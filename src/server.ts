throw new Error(
  'The React Server cannot be used outside a react-server environment. ' +
    'You must configure Node.js using the `--conditions react-server` flag.',
);
