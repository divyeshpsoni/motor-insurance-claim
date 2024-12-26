export const paginate = async (
  model,
  query = {},
  fieldsToExclude = "",
  page = 1,
  limit = 10
) => {
  // calculate the number of users to skip for the current page
  const skip = (page - 1) * limit;

  // get the total number of users
  const totalItems = await model.countDocuments(query);

  // calculate total pages
  const totalPages = Math.ceil(totalItems / limit);

  // get paginated documents
  const items = await model
    .find(query, fieldsToExclude)
    .skip(skip)
    .limit(limit);

  // pagination data
  const pagination = {
    currentPage: page,
    totalPages,
    limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return { items, totalItems, pagination };
};
