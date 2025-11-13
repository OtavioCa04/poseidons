function generateSequentialCode(prefix, lastCode, digits = 5) {
  const sanitizedPrefix = prefix || '';
  if (!lastCode) {
    return `${sanitizedPrefix}${String(1).padStart(digits, '0')}`;
  }

  const numericPart = parseInt(lastCode.replace(sanitizedPrefix, ''), 10);
  const nextValue = Number.isNaN(numericPart) ? 1 : numericPart + 1;
  return `${sanitizedPrefix}${String(nextValue).padStart(digits, '0')}`;
}

module.exports = { generateSequentialCode };
