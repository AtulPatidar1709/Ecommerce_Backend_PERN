import { getOrdersQuerySchema } from '../oder.schema';

// Helper to parse and validate query parameters
const parseQuery = (query: Record<string, unknown>) => {
  return getOrdersQuerySchema.parse(query);
};

export { parseQuery };
