import { handleAuth } from '@auth0/nextjs-auth0';

// la estructura de esto y como esta almacenado en la api nos permite acceder a los distintos endpoints que ofrece auth0, ya sea
// por login, logout, subscribe, etc.

// con esto cada vez que vayamos a localhost:3000/api/auth/login podemos loguearnos

export default handleAuth();