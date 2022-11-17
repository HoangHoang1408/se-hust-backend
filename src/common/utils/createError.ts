import { CoreOutput } from '../dto/output.dto';

export function createError(mainReason: string, message: string): CoreOutput {
  return {
    ok: false,
    error: {
      mainReason,
      message,
    },
  };
}
