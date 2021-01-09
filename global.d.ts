//Type definition for p5 and socket.io scripts used on web browser side

import type p5 from 'p5';
import type { io } from 'socket.io-client';

declare global {    //Global variables
    let p5: typeof p5;
    const io: typeof io;
}