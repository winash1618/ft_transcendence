import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { BadRequestException } from '@nestjs/common';

@Catch()
export class WsExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();

    if (exception instanceof WsException) {
      return client.emit('exception', { status: 'error', message: exception.getError() });
    }

    if (exception instanceof BadRequestException) {
      return client.emit('exception', { status: 'error', message: exception.message });
    }

    return client.emit('exception', { status: 'error', message: 'Internal server error' });
  }
}
