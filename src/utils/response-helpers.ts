
/* eslint-disable @typescript-eslint/no-explicit-any */
export const errorResponse = (error: any = {}, message: string) => {
    return {
      success: false,
      message,
      error,
    };
  };

  export const successResponse = (data: any = {}, message: string) => {
    return {
      success: true,
      message,
      data,
    };
  };
  
 
  