const toLookupItemDTO = (item) => {
  const { value, label, ...meta } = item;

  return {
    value,
    label,
    meta,
  };
};

const toLookupListDTO = (items = []) => items.map(toLookupItemDTO);

module.exports = {
  toLookupItemDTO,
  toLookupListDTO,
};
