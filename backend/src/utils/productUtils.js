// Generate unique SKU
const generateSKU = async (database, productName, category) => {
  // Create prefix from category (first 3 letters) and product name (first 3 letters)
  const categoryPrefix = (category || 'GEN').substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
  const namePrefix = productName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
  const basePrefix = categoryPrefix + namePrefix;
  
  // Find the next available number
  const existingSkus = await database.all(
    'SELECT sku FROM products WHERE sku LIKE ? ORDER BY sku DESC LIMIT 1',
    [`${basePrefix}%`]
  );
  
  let nextNumber = 1;
  if (existingSkus.length > 0) {
    const lastSku = existingSkus[0].sku;
    const match = lastSku.match(/(\d+)$/);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }
  
  return `${basePrefix}${String(nextNumber).padStart(4, '0')}`;
};

// Generate barcode (EAN-13 format)
const generateBarcode = async (database) => {
  // Generate 12 digit random number, last digit will be check digit
  let barcode;
  let exists = true;
  
  while (exists) {
    const random12Digits = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    barcode = random12Digits + calculateEAN13CheckDigit(random12Digits);
    
    // Check if barcode already exists
    const existing = await database.get(
      'SELECT id FROM products WHERE barcode = ?',
      [barcode]
    );
    exists = !!existing;
  }
  
  return barcode;
};

// Calculate EAN-13 check digit
const calculateEAN13CheckDigit = (digits) => {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(digits[i]);
    sum += (i % 2 === 0) ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit.toString();
};

module.exports = {
  generateSKU,
  generateBarcode
};
