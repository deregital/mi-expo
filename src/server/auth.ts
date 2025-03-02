import NextAuth, {
  CredentialsSignin,
  type Session,
  type DefaultSession,
} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { fetchClient } from '@/server/fetchClient';
import { type JWT } from 'next-auth/jwt';
import { ZodError } from 'zod';

declare module 'next-auth/jwt' {
  interface JWT {
    user:
      | {
          id: string;
          username: string;
        }
      | {
          id: string;
          phoneNumber: string;
        };
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    type: Session['type'];
  }
}

declare module 'next-auth' {
  interface Session {
    expires: DefaultSession['expires'];
    user?: (
      | {
          id: string;
          username: string;
        }
      | {
          id: string;
          phoneNumber: string;
        }
    ) &
      DefaultSession['user'];
    type: 'usernamePassword' | 'phoneNumber';
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

const { handlers, signIn, signOut, auth } = NextAuth({
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
        user:
          token.type === 'usernamePassword'
            ? {
                ...session.user,
                id: token.sub!,
                username: token.username,
                role: token.role,
              }
            : token.type === 'phoneNumber'
              ? {
                  id: token.sub!,
                  phoneNumber: token.phoneNumber,
                }
              : undefined,
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
      name: 'PhoneNumber',
      credentials: {
        phoneNumber: { label: 'Número de teléfono', type: 'tel' },
      },
      id: 'phoneNumber',
      type: 'credentials',
      async authorize(credentials) {
        try {
          if (!credentials.phoneNumber) {
            throw new CustomError('Número de teléfono no válido');
          }

          const { response, data, error } = await fetchClient.POST(
            '/mi-expo/login-with-phone',
            {
              body: {
                phoneNumber: credentials.phoneNumber as string,
              },
            },
          );

          if ((response.status !== 201 || !data?.profile) && error) {
            const message = error.message[0] || 'Error desconocido';
            throw new CustomError(message);
          }
          return {
            id: data.profile.id!,
            phoneNumber: data.profile.phoneNumber!,
            backendTokens: data.tokens,
            type: 'phoneNumber',
          };
        } catch (error) {
          throwError(error);
          return null;
        }
      },
    }),
    Credentials({
      name: 'UsernamePassword',
      credentials: {
        username: { label: 'Nombre de usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      id: 'UsernamePassword',
      type: 'credentials',
      async authorize(credentials) {
        try {
          if (!credentials.username || !credentials.password) {
            throw new CustomError('Usuario o contraseña no válidos');
          }

          const { response, data, error } = await fetchClient.POST(
            '/mi-expo/login',
            {
              body: {
                password: credentials.password as string,
                username: credentials.username as string,
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
            backendTokens: data.backendTokens,
            type: 'usernamePassword',
          };
        } catch (error) {
          throwError(error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handlers, signIn, signOut, auth };

export class CustomError extends CredentialsSignin {
  code = CustomError.CUSTOM_ERROR_CODE;
  static CUSTOM_ERROR_CODE = Symbol('CUSTOM_ERROR_CODE').toString();
  constructor(msg: string) {
    super();
    this.message = msg;
  }
}

function throwError(error: unknown) {
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
}
