import { useContext } from 'react';

import authContext, { websocketContext } from '../contexts';

const useAuth = () => useContext(authContext);

export const useWebsocket = () => useContext(websocketContext);

export default useAuth;
