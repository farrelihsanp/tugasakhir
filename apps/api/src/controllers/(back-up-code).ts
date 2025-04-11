
/* -------------------------------------------------------------------------- */
/*                                 BACKUP CODE                                */
/* -------------------------------------------------------------------------- */

// export const applyVoucher = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const userId = req.user?.id;
//     const { voucherId, shippingCostSelected } = req.body;

//     if (!voucherId) {
//       res.status(400).json({ error: 'Voucher ID is required' });
//       return;
//     }

//     if (!userId) {
//       res.status(401).json({ error: 'Unauthorized' });
//       return;
//     }

//     /* -------------------------------------------------------------------------- */
//     /*                                  CART USER                                 */
//     /* -------------------------------------------------------------------------- */
//     const cartUser = await prisma.cart.findFirst({
//       where: {
//         userId: userId,
//       },
//       include: {
//         cartItems: true,
//       },
//     });

//     if (!cartUser) {
//       res.status(404).json({ error: 'Cart not found' });
//       return;
//     }

//     /* -------------------------------------------------------------------------- */
//     /*                               VOUCHER USERNYA                              */
//     /* -------------------------------------------------------------------------- */
//     const voucherSelectedToApply = await prisma.voucher.findFirst({
//       where: {
//         id: Number(voucherId),
//       },
//     });

//     if (!voucherSelectedToApply) {
//       res.status(404).json({ error: 'Voucher not found' });
//       return;
//     }

//     /* -------------------------------------------------------------------------- */
//     /*                               TOTAL BELANJAAN                              */
//     /* -------------------------------------------------------------------------- */

//     const totalAmount = cartUser.totalAmount;

//     // VOUCHER BELANJAAN

//     if (
//       voucherSelectedToApply.voucherCategory === VoucherCategory.SHIPPING_COST
//     ) {
//       let finalAmountAfterVoucher: number = 0;
//       if (voucherSelectedToApply.voucherType === 'AMOUNT') {
//         const voucherValue = voucherSelectedToApply.value;
//         finalAmountAfterVoucher = totalAmount - voucherValue;

//         if (totalAmount < voucherValue) {
//           res
//             .status(400)
//             .json({ error: 'Voucher amount exceeds total amount' });
//           return;
//         }

//         if (finalAmountAfterVoucher < 0) {
//           res
//             .status(400)
//             .json({ error: 'Voucher amount exceeds total amount' });
//           return;
//         }

//         // PERSENTASE
//       } else if (voucherSelectedToApply.voucherType === 'PERCENTAGE') {
//         const voucherValue = voucherSelectedToApply.value;
//         finalAmountAfterVoucher = (totalAmount * (100 - voucherValue)) / 100;

//         const maxPriceReduction = voucherSelectedToApply.maxPriceReduction;

//         if (maxPriceReduction && finalAmountAfterVoucher > maxPriceReduction) {
//           finalAmountAfterVoucher = maxPriceReduction;
//         }

//         if (finalAmountAfterVoucher < 0) {
//           res
//             .status(400)
//             .json({ error: 'Voucher amount exceeds total amount' });
//           return;
//         }
//       }

//       await prisma.cart.update({
//         where: {
//           id: cartUser.id,
//         },
//         data: {
//           totalAmountAfterVoucher: finalAmountAfterVoucher,
//           valueVoucher: finalAmountAfterVoucher - totalAmount,
//         },
//       });
//     }

//     /* -------------------------------------------------------------------------- */
//     // VOUCHER JASA ONGKIR

//     let finalShippingCost: number = 0;

//     if (
//       voucherSelectedToApply.voucherCategory === VoucherCategory.SHIPPING_COST
//     ) {
//       if (voucherSelectedToApply.voucherType === 'AMOUNT') {
//         const voucherValue = voucherSelectedToApply.value;
//         finalShippingCost = shippingCostSelected - voucherValue;

//         if (shippingCostSelected < voucherValue) {
//           res
//             .status(400)
//             .json({ error: 'Voucher amount exceeds total amount' });
//           return;
//         }

//         if (finalShippingCost < 0) {
//           res
//             .status(400)
//             .json({ error: 'Voucher amount exceeds total amount' });
//           return;
//         }

//         // PERSENTASE
//       } else if (voucherSelectedToApply.voucherType === 'PERCENTAGE') {
//         const voucherValue = voucherSelectedToApply.value;
//         finalShippingCost = (shippingCostSelected * (100 - voucherValue)) / 100;

//         const maxPriceReduction = voucherSelectedToApply.maxPriceReduction;

//         if (maxPriceReduction && finalShippingCost > maxPriceReduction) {
//           finalShippingCost = maxPriceReduction;
//         }

//         if (finalShippingCost < 0) {
//           res
//             .status(400)
//             .json({ error: 'Voucher amount exceeds total amount' });
//           return;
//         }
//       }
//     }

//     /* -------------------------------------------------------------------------- */

//     res.status(200).json({
//       ok: true,
//       message: 'Voucher applied successfully',
//       data: {
//         finalShippingCost,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };
