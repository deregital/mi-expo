import NextAuth, { CredentialsSignin, type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { fetchClient } from '@/server/fetchClient';
import { type JWT } from 'next-auth/jwt';
import { loginSchema } from 'expo-backend-types';
import { ZodError } from 'zod';

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string;
      username: string;
    };
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}

declare module 'next-auth' {
  interface Session {
    expires: DefaultSession['expires'];
    user?: {
      id: string;
      username: string;
      esAdmin: boolean;
    } & DefaultSession['user'];
  }
}

export async function refreshToken(token: JWT): Promise<JWT> {
  const { data, response } = await fetchClient.POST('/auth/refresh', {
    headers: {
      authorization: `Refresh ${token.backendTokens.refreshToken}`,
    },
  });

  if (response.status !== 201 || !data) {
    throw new Error('Error al refrescar el token');
  }

  return {
    ...token,
    backendTokens: data!,
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, token }) => {
      fetchClient.use({
        onRequest: ({ request }) => {
          request.headers.set(
            'Authorization',
            `Bearer ${token.backendTokens.accessToken}`,
          );
          return request;
        },
      });
      return {
        ...session,
        backendTokens: {
          ...token.backendTokens,
        },
        user: {
          ...session.user,
          id: token.sub,
          username: token.username,
          esAdmin: token.esAdmin,
        },
      };
    },

    async jwt({ user, token }) {
      if (user) {
        return { ...user, ...token };
      }

      const shouldRefresh =
        token?.backendTokens.expiresIn < new Date().getTime();

      if (shouldRefresh) {
        return await refreshToken(token);
      }

      return token;
    },
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Nombre de usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      id: 'credentials',
      type: 'credentials',
      async authorize(credentials) {
        try {
          const { username, password } =
            await loginSchema.parseAsync(credentials);

          const { response, data, error } = await fetchClient.POST(
            '/auth/login',
            {
              body: {
                password: password,
                username: username,
              },
            },
          );

          if ((response.status !== 201 || !data?.user) && error) {
            const message = error.message[0] || 'Error desconocido';
            throw new CustomError(message);
          }

          return {
            id: data.user.id!,
            username: data.user.username!,
            esAdmin: data.user.role === 'ADMIN',
            backendTokens: data.backendTokens,
          };
        } catch (error) {
          if (
            error instanceof ZodError ||
            (process.env.NODE_ENV !== 'production' &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (error as any).constructor.name === ZodError.name)
          ) {
            const msg = (error as ZodError).issues?.[0].message;
            if (msg) {
              throw new CustomError(msg);
            }
          }

          if (error instanceof CustomError) {
            throw new CustomError(error.message);
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
});

export class CustomError extends CredentialsSignin {
  code = CustomError.CUSTOM_ERROR_CODE;
  static CUSTOM_ERROR_CODE = Symbol('CUSTOM_ERROR_CODE').toString();
  constructor(msg: string) {
    super();
    this.message = msg;
  }
}
