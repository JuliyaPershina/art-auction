export function formatToDollar(cents: number) {
    return `${Math.floor(cents / 100).toFixed(2)}`;
} ;

// export function formatToDollar(cents: number) {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//   }).format(cents / 100);
// }