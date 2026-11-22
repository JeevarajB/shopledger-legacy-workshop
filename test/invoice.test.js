'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const invoice = require('../lib/invoice');

// In-memory fixtures copied from the ticket description; no database access.
const order1002 = {
  id: 1002,
  coupon: 'SAVE10',
  items: [
    { name: 'Indrayani Basmati Rice 5kg', sku: 'GRN-001', hsn: '1006', price: 640, qty: 1 },
    { name: 'Cold-Pressed Sunflower Oil 1L', sku: 'OIL-001', hsn: '1512', price: 190, qty: 2 }
  ],
  subtotal: 1020,
  discount: 102,
  tax: 45.9,
  total: 963.9
};

const order1004 = {
  id: 1004,
  coupon: 'SAVE10',
  items: [
    { name: 'Cold-Pressed Groundnut Oil 5L', sku: 'OIL-002', hsn: '1508', price: 1120, qty: 2 }
  ],
  subtotal: 2240,
  discount: 150,
  tax: 104.5,
  total: 2194.5
};

test('invoice resolves each item GST rate from its HSN and discounts tax proportionally', function () {
  const figures = invoice.computeInvoiceFigures(order1002);

  assert.equal(figures.subtotal, order1002.subtotal);
  assert.equal(figures.discount, order1002.discount);
  assert.deepEqual(figures.rows.map(function (row) { return row.gstPercent; }), [5, 5]);
  assert.deepEqual(figures.rows.map(function (row) { return row.lineTax; }), [28.8, 17.1]);
  assert.equal(figures.tax, order1002.tax);
  assert.equal(figures.cgst, 22.95);
  assert.equal(figures.sgst, 22.95);
  assert.equal(figures.total, order1002.total);
});

test('invoice applies the configured maximum discount for SAVE10', function () {
  const figures = invoice.computeInvoiceFigures(order1004);

  assert.equal(figures.rows[0].gstPercent, 5);
  assert.equal(figures.discount, 150);
  assert.equal(figures.tax, order1004.tax);
  assert.equal(figures.total, order1004.total);
});

test('invoice uses the 12% HSN slab on non-coupon orders', function () {
  const figures = invoice.computeInvoiceFigures({
    items: [{ name: 'A2 Gir Cow Ghee 500ml', hsn: '0405', price: 450, qty: 2 }],
    coupon: ''
  });

  assert.equal(figures.rows[0].gstPercent, 12);
  assert.equal(figures.tax, 108);
  assert.equal(figures.total, 1008);
});

test('rendered invoice omits a reconciliation warning when stored totals match checkout', function () {
  const html = invoice.render(order1002);

  assert.match(html, /₹963\.90/);
  assert.doesNotMatch(html, /Accountant Reconciliation Notice/);
});
