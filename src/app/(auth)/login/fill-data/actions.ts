import { signIn } from '@/server/auth';

export async function signInUsernmePassword({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  await signIn('usernamePassword', {
    username,
    password,
    redirect: false,
  });
}
