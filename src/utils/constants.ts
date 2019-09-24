export const DEFAULT_API_ACTIONS = {
  GET: true,
  POST: true,
  DELETE: true,
  PUT: true,
};

export enum Layer {
  service = 'service',
  controller = 'controller',
  module = 'module',
  repository = 'repository',
}

export enum Verb {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
