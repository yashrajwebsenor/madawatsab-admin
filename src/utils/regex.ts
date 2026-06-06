const REGEX = {
  COMA_SEPARATED: /^[^,]+(,[^,]+)*$/,
  VIDEO: /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i,
  VALID_URL:
    /^(https?:\/\/)?([a-zA-Z0-9.-]+(:[0-9]+)?(\.[a-zA-Z]{2,})?)((\/.*)?)$/,
};

export default REGEX;
