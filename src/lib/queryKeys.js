export const queryKeys = {
  items: {
    all: ['items'],
    list: (params) => ['items', 'list', params],
    detail: (id) => ['items', 'detail', id],
  },
  stores: {
    all: ['stores'],
    list: (params) => ['stores', 'list', params],
    detail: (id) => ['stores', 'detail', id],
  },
  offices: {
    all: ['offices'],
    list: (params) => ['offices', 'list', params],
    detail: (id) => ['offices', 'detail', id],
  },
  zones: {
    all: ['zones'],
    list: (params) => ['zones', 'list', params],
    detail: (id) => ['zones', 'detail', id],
  },
  purchaseRequests: {
    all: ['purchase-requests'],
    list: (params) => ['purchase-requests', 'list', params],
    detail: (id) => ['purchase-requests', 'detail', id],
  },
  clientCategories: {
    all: ['client-categories'],
    list: (params) => ['client-categories', 'list', params],
    detail: (id) => ['client-categories', 'detail', id],
  },
};
