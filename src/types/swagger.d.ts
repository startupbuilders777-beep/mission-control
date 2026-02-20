declare module 'swagger-ui-react' {
  import { ComponentType } from 'react';
  
  interface SwaggerUIProps {
    spec?: Record<string, unknown>;
    url?: string;
    docExpansion?: 'list' | 'full' | 'none';
    persistAuthorization?: boolean;
  }
  
  const SwaggerUI: ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}
