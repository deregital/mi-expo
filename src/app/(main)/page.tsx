import { InstallPWAButton } from '@/components/common/install-pwa-button';
import { auth, signIn, signOut } from '@/server/auth';
import { trpc } from '@/server/trpc/server';
import Image from 'next/image';

export default async function Home() {
  const session = await auth();

  const me = await trpc.me.get();
  const productions = await trpc.production.getAll();

  return (
    <div className='flex items-center justify-center flex-col h-full'>
      <h1 className='text-7xl'>Mi expo</h1>
      <p>Hola {me?.username}</p>

      {me?.productionsAdministrated.length !== 0 ? (
        <>
          <p>ADMINISTRADOR DE ALGUNA PRODUCCIÓN</p>
          <ul>
            <li>
              <p className='font-bold'>Mis Producciones</p>
              <ul>
                {me!.productionsAdministrated.map((prod) => {
                  return (
                    <li key={prod.id}>
                      {prod.id} - {prod.name}
                    </li>
                  );
                })}
              </ul>
            </li>
            <li>
              <p className='font-bold'>Solicitudes</p>
              {me?.productionRequestsSent.length !== 0 ? (
                <ul>
                  {me?.productionRequestsSent.map((prod) => {
                    return (
                      <li key={prod.id}>
                        {prod.id} {prod.status} Aceptar -- Rechazar
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No hay solicitudes</p>
              )}
            </li>
          </ul>
        </>
      ) : (
        <>
          <p className='font-bold'>NO ADMINISTRADOR DE NINGUNA PRODUCCIÓN</p>
          {me?.productionsParticipated.length !== 0 ? (
            <ul>
              <li>
                <p className='font-bold'>Mi producción</p>
                <ul>
                  {me!.productionsParticipated.map((prod) => {
                    return (
                      <li key={prod.id}>
                        {prod.name} {prod.administratorId}
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          ) : (
            <>
              <p>
                {' '}
                Producciones disponibles con botón para anotarse (crear
                solicitud de afiliación)
              </p>
              <ul>
                {productions?.productions.map((prod) => {
                  return (
                    <li key={prod.id}>
                      {prod.administrator?.username} - {prod.name}
                      {/* <SimpleButton action={() => trpc.productionAfilliationRequest.create(prod.id)} title='Enviar solicitud de afiliación' /> */}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
      )}
      <Image
        alt='Alt'
        src='https://resizer.glanacion.com/resizer/v2/tato-bores-DXEIEHLPJBG6TI32YJIVRXCC7A.jpg?auth=e62464bc213e4a17fc826c9a06c85c7e27ee7be48938ff9fcbe233ea325dd6c3&width=1200&quality=70&smart=false&height=800'
        width={500}
        height={500}
      />
      <InstallPWAButton />
      {session ? (
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button type='submit'>Logout</button>
        </form>
      ) : (
        <form
          action={async () => {
            'use server';
            await signIn();
          }}
        >
          <button type='submit'>Login</button>
        </form>
      )}
    </div>
  );
}
