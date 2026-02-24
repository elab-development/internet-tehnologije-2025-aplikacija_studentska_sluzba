declare module "swagger-ui-react" {
  const SwaggerUI: React.ComponentType<{ url?: string; spec?: object }>;
  export default SwaggerUI;
}

declare module "swagger-ui-react/swagger-ui.css";