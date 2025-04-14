import { hash, genSalt } from 'bcryptjs';

import { prisma } from '../src/configs/prisma.js';
import {
  OrderStatus,
  VoucherCategory,
  VoucherType,
  PaymentMethodType,
} from '@prisma/client';

async function main() {
  try {
    /* -------------------------------------------------------------------------- */
    /*                                 Reset Data                                 */
    /* -------------------------------------------------------------------------- */
    console.info('Menghapus data yang ada...');

    await prisma.cart.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.address.deleteMany();
    await prisma.product.deleteMany();
    await prisma.store.deleteMany();
    await prisma.order.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.category.deleteMany();
    await prisma.categoryProduct.deleteMany();
    await prisma.referral.deleteMany();
    await prisma.confirmToken.deleteMany();
    await prisma.voucherProduct.deleteMany();
    await prisma.shippingInformation.deleteMany();
    await prisma.storeUser.deleteMany();
    await prisma.user.deleteMany();
    await prisma.voucher.deleteMany();
    console.info('Data yang ada berhasil dihapus.');

    /* -------------------------------------------------------------------------- */
    /*                                  User Seed                                 */
    /* -------------------------------------------------------------------------- */
    const salt = await genSalt(10);

    // Superadmin User
    const superadminPassword = await hash('superadminpass', salt);
    const superadmin = await prisma.user.create({
      data: {
        name: 'John Doe',
        username: 'johndoe',
        password: superadminPassword,
        email: 'johndoe@example.com',
        emailConfirmed: true,
        role: 'SUPERADMIN',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627186/education-confrence_jujt4f.jpg',
        referralNumber: 'REF123456',
        provider: 'CREDENTIALS',
      },
    });

    // Storeadmin User
    const storeadminPassword1 = await hash('storeadminpass', salt);
    const storeadmin1 = await prisma.user.create({
      data: {
        name: 'Jane Smith',
        username: 'janesmith',
        password: storeadminPassword1,
        email: 'janesmith@example.com',
        emailConfirmed: true,
        role: 'STOREADMIN',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627186/education-confrence_jujt4f.jpg',
        referralNumber: 'REF654321',
        provider: 'CREDENTIALS',
      },
    });

    const storeadminPassword2 = await hash('storeadminpass', salt);
    const storeadmin2 = await prisma.user.create({
      data: {
        name: 'Diana Siregar',
        username: 'dianasiregar',
        password: storeadminPassword2,
        email: 'dianasiregar@example.com',
        emailConfirmed: true,
        role: 'STOREADMIN',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627186/education-confrence_jujt4f.jpg',
        referralNumber: 'REF654324',
        provider: 'CREDENTIALS',
      },
    });

    const storeadminPassword3 = await hash('storeadminpass', salt);
    const storeadmin3 = await prisma.user.create({
      data: {
        name: 'Jadot Budi Purnomo',
        username: 'purnomo',
        password: storeadminPassword3,
        email: 'purnomo@example.com',
        emailConfirmed: true,
        role: 'STOREADMIN',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627186/education-confrence_jujt4f.jpg',
        referralNumber: 'REF123321',
        provider: 'CREDENTIALS',
      },
    });

    const storeadminPassword4 = await hash('storeadminpass', salt);
    const storeadmin4 = await prisma.user.create({
      data: {
        name: 'Budi Gunawan',
        username: 'budigunawan',
        password: storeadminPassword4,
        email: 'budigunawan@example.com',
        emailConfirmed: true,
        role: 'STOREADMIN',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627186/education-confrence_jujt4f.jpg',
        referralNumber: 'REF123399',
        provider: 'CREDENTIALS',
      },
    });

    const storeadminPassword5 = await hash('storeadminpass', salt);
    await prisma.user.create({
      data: {
        name: 'Bagus Saragih',
        username: 'bagussaragih',
        password: storeadminPassword5,
        email: 'bagussaragih@example.com',
        emailConfirmed: true,
        role: 'STOREADMIN',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627186/education-confrence_jujt4f.jpg',
        referralNumber: 'REF123329',
        provider: 'CREDENTIALS',
      },
    });

    // Customer User
    const customerPassword = await hash('farrel123', salt);
    const customer1 = await prisma.user.create({
      data: {
        name: 'Farrel Ihsan Ganteng',
        username: 'farrelihsanp',
        password: customerPassword,
        email: 'farrel.prahaditya@gmail.com',
        emailConfirmed: true,
        role: 'CUSTOMERS',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg',
        referralNumber: 'REF112295',
        provider: 'CREDENTIALS',
      },
    });

    const customerPassword2 = await hash('fauzan123', salt);
    await prisma.user.create({
      data: {
        name: 'Fauzan Rianda',
        username: 'fauzanrianda',
        password: customerPassword2,
        email: 'fauzanrianda@gmail.com',
        emailConfirmed: true,
        role: 'CUSTOMERS',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg',
        referralNumber: 'REF999500',
        provider: 'CREDENTIALS',
      },
    });

    const customerPassword3 = await hash('fitra123', salt);
    await prisma.user.create({
      data: {
        name: 'Fitra Firmansyah',
        username: 'fitrafirmansyah',
        password: customerPassword3,
        email: 'fitrafirmansyah@gmail.com',
        emailConfirmed: true,
        role: 'CUSTOMERS',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg',
        referralNumber: 'REF129999',
        provider: 'CREDENTIALS',
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Store Seed                                */
    /* -------------------------------------------------------------------------- */
    const store1 = await prisma.store.create({
      data: {
        name: 'Toko Apple Apartment Jatipadang',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Jatipadang Raya',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        country: 'Indonesia',
        postalCode: '20111',
        phoneNumber: '081234567890',
        slug: 'toko-apple-apartment-jatipadang',
        latitude: -6.291792587863591,
        longitude: 106.82860649874273,
        maxServiceDistance: 25000.0,
        isActive: true,
      },
    });

    const store2 = await prisma.store.create({
      data: {
        name: 'Toko Taman Karang Pola',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Raya Ragunan',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        country: 'Indonesia',
        postalCode: '28111',
        phoneNumber: '081234567891',
        slug: 'toko-taman-karang-pola',
        latitude: -6.286289550419184,
        longitude: 106.83149673268163,
        maxServiceDistance: 100000.0,
        isActive: true,
        isPrimary: true,
      },
    });

    const store3 = await prisma.store.create({
      data: {
        name: 'Toko Kelontong Purwadhika',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Jaya No. 789',
        city: 'Bandung',
        province: 'Jawa Barat',
        country: 'Indonesia',
        postalCode: '40111',
        phoneNumber: '081234567892',
        slug: 'toko-kelontong-jaya',
        latitude: -6.210676140910337,
        longitude: 106.82231722418967,
        maxServiceDistance: 20000.0,
        isActive: true,
      },
    });

    const store4 = await prisma.store.create({
      data: {
        name: 'Toko Kelontong SPBU Kemang',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Makmur No. 321',
        city: 'Surabaya',
        province: 'Jawa Timur',
        country: 'Indonesia',
        postalCode: '60111',
        phoneNumber: '081234567893',
        slug: 'toko-kelontong-makmur',
        latitude: -6.266846372000018,
        longitude: 106.81561643680142,
        maxServiceDistance: 50000.0,
        isActive: true,
      },
    });

    await prisma.store.create({
      data: {
        name: 'Toko Kelontong Perempatan Ampera',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Sehat No. 654',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        country: 'Indonesia',
        postalCode: '10110',
        phoneNumber: '081234567894',
        slug: 'toko-kelontong-sehat',
        latitude: -6.181125939416333,
        longitude: 106.82691064650164,
        maxServiceDistance: 150000.0,
        isActive: true,
      },
    });

    // Assign store admins to stores
    await prisma.storeUser.create({
      data: {
        userId: storeadmin1.id,
        storeId: store1.id,
      },
    });

    await prisma.storeUser.create({
      data: {
        userId: storeadmin2.id,
        storeId: store2.id,
      },
    });

    await prisma.storeUser.create({
      data: {
        userId: storeadmin3.id,
        storeId: store3.id,
      },
    });

    await prisma.storeUser.create({
      data: {
        userId: storeadmin4.id,
        storeId: store4.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Category Seed                             */
    /* -------------------------------------------------------------------------- */
    const sayurCategory = await prisma.category.create({
      data: {
        name: 'Sayuran',
        excerpt: 'Sayuran segar',
        description: 'Berbagai jenis sayuran segar dan berkualitas',
        image:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743477309/SAYURAN_wigiuz.jpg',
        slug: 'sayuran',
      },
    });

    const buahCategory = await prisma.category.create({
      data: {
        name: 'Buah',
        excerpt: 'Buah segar',
        description: 'Berbagai jenis buah segar dan berkualitas',
        image:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743477308/BUAH_pu071u.jpg',
        slug: 'buah',
      },
    });

    const makananRinganCategory = await prisma.category.create({
      data: {
        name: 'Makanan Ringan',
        excerpt: 'Makanan ringan',
        description: 'Berbagai jenis makanan ringan',
        image:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743477308/MAKANAN_RINGAN_kte3tc.jpg',
        slug: 'makanan-ringan',
      },
    });

    const minumanCategory = await prisma.category.create({
      data: {
        name: 'Minuman',
        excerpt: 'Minuman',
        description: 'Berbagai jenis minuman',
        image:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743477308/MINUMAN_glvhk8.jpg',
        slug: 'minuman',
      },
    });

    const peralatanMandiCategory = await prisma.category.create({
      data: {
        name: 'Peralatan Mandi',
        excerpt: 'Peralatan mandi',
        description: 'Berbagai jenis peralatan mandi',
        image:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743477308/peralatan-mandi_bcxn91.jpg',
        slug: 'peralatan-mandi',
      },
    });

    const peralatanDapurCategory = await prisma.category.create({
      data: {
        name: 'Peralatan Dapur',
        excerpt: 'Peralatan dapur',
        description: 'Berbagai jenis peralatan dapur',
        image:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743477311/peralatan-dapur_oxlwhq.jpg',
        slug: 'peralatan-dapur',
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Product Seed                              */
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                                    PRODUK TOMAT                                   */
    /* -------------------------------------------------------------------------- */
    const tomat = await prisma.product.create({
      data: {
        name: 'Tomat',
        excerpt: 'Tomat segar',
        description: 'Tomat segar berkualitas tinggi',
        slug: 'tomat',
        weight: 1.0,
        ProductImages: {
          createMany: {
            data: [
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350535/TOMAT-5_ou8ykd.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350534/TOMAT-4_ihcati.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350534/TOMAT-3_ykxgco.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350534/TOMAT-1_l7x9lq.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350534/TOMAT-2_glqtwh.jpg',
              },
            ],
          },
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: tomat.id,
        price: 10000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: tomat.id,
        categoryId: sayurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  PRODUK SEMANGKA                                  */
    /* -------------------------------------------------------------------------- */
    const semangka = await prisma.product.create({
      data: {
        name: 'Semangka',
        excerpt: 'Semangka dari pohon',
        description: 'Semangka segar berkualitas tinggi',
        slug: 'semangka',
        weight: 5.0,
        ProductImages: {
          createMany: {
            data: [
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350640/SEMANGKA-2_rcr4kw.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350640/SEMANGKA-3_wxbwb7.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350640/SEMANGKA-5_xtonsp.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350640/SEMANGKA-4_prjrxe.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350639/SEMANGKA-1_huhysp.jpg',
              },
            ],
          },
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store2.id,
        productId: semangka.id,
        price: 5000,
        stock: 150,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: semangka.id,
        categoryId: buahCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                   PRODUK CHITATO                                  */
    /* -------------------------------------------------------------------------- */
    const chitato = await prisma.product.create({
      data: {
        name: 'Chitato',
        excerpt: 'Chitato ',
        description: 'Chitato segar',
        slug: 'chitato',
        weight: 0.2,
        ProductImages: {
          createMany: {
            data: [
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350874/CHITATO-4_xfhn9f.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350873/CHITATO-5_qvtt6i.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350873/CHITATO-3_trl0oj.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350873/CHITATO-2_yctkai.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350873/CHITATO-1_wsc5rw.jpg',
              },
            ],
          },
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store3.id,
        productId: chitato.id,
        price: 5000,
        stock: 150,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: chitato.id,
        categoryId: makananRinganCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                 PRODUK AIR AQUA                            */
    /* -------------------------------------------------------------------------- */
    const airAqua = await prisma.product.create({
      data: {
        name: 'Air Mineral',
        excerpt: 'Air mineral',
        description: 'Air mineral segar',
        slug: 'air-mineral',
        weight: 0.5,
        ProductImages: {
          createMany: {
            data: [
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350995/AQUA-5_tabctd.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350995/AQUA-4_acjzxw.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350995/AQUA-3_wsusfp.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350994/AQUA-1_nuzezw.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350994/AQUA-2_alrxfo.jpg',
              },
            ],
          },
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store4.id,
        productId: airAqua.id,
        price: 3000,
        stock: 200,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: airAqua.id,
        categoryId: minumanCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                             PRODUK SABUN MANDI                             */
    /* -------------------------------------------------------------------------- */
    const sabunMandi = await prisma.product.create({
      data: {
        name: 'Sabun Mandi Life Boy',
        excerpt: 'Sabun mandi',
        description: 'Sabun mandi berkualitas tinggi',
        slug: 'sabun-mandi',
        weight: 0.5,
        ProductImages: {
          createMany: {
            data: [
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351121/SABUN-5_li1087.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351120/SABUN-4_renpvn.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351120/SABUN-3_urz6mr.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351120/SABUN-2_gqz3n6.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351120/SABUN-1_mgtopn.jpg',
              },
            ],
          },
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: sabunMandi.id,
        price: 7000,
        stock: 120,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: sabunMandi.id,
        categoryId: peralatanMandiCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK PANCI                                */
    /* -------------------------------------------------------------------------- */
    const panci = await prisma.product.create({
      data: {
        name: 'Panci',
        excerpt: 'Panci',
        description: 'Panci berkualitas tinggi',
        slug: 'panci',
        weight: 2.0,
        ProductImages: {
          createMany: {
            data: [
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351228/PANCI-5_uh8lrg.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351226/PANCI-4_wms6dp.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351225/PANCI-2_tnl5bu.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351225/PANCI-3_thiuyq.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351224/PANCI-1_adthbw.jpg',
              },
            ],
          },
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: panci.id,
        price: 75000,
        stock: 80,
        isCheap: false,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: panci.id,
        categoryId: peralatanDapurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK WORTEL                               */
    /* -------------------------------------------------------------------------- */
    const wortel = await prisma.product.create({
      data: {
        name: 'Wortel',
        excerpt: 'Wortel',
        description: 'Wortel berkualitas tinggi',
        slug: 'wortel',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622106/WORTEL-5_bvexyb.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622106/WORTEL-3_vzybd4.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622106/WORTEL-1_eatwp2.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622106/WORTEL-4_f5rb6w.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622106/WORTEL-2_xrkmju.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: wortel.id,
        price: 6000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: wortel.id,
        categoryId: sayurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK BAYAM                                */
    /* -------------------------------------------------------------------------- */
    const bayam = await prisma.product.create({
      data: {
        name: 'Bayam',
        excerpt: 'Bayam',
        description: 'Bayam berkualitas tinggi',
        slug: 'bayam',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622153/BAYAM-4_qzomd8.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622153/BAYAM-2_pbjbgh.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622152/BAYAM-3_o0rdge.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622152/BAYAM-5_dp1a4e.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622151/BAYAM-1_x7eav6.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: bayam.id,
        price: 8000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: bayam.id,
        categoryId: sayurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                 PRODUK KOL                                 */
    /* -------------------------------------------------------------------------- */
    const kol = await prisma.product.create({
      data: {
        name: 'Kol',
        excerpt: 'Kol',
        description: 'Kol berkualitas tinggi',
        slug: 'kol',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622195/KOL-2_y1me6q.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622195/KOL-5_x8hkam.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622194/KOL-3_al25f7.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622195/KOL-4_bna5tk.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622194/KOL-1_hvu4lz.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: kol.id,
        price: 10000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: kol.id,
        categoryId: sayurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                               PRODUK KANGKUNG                              */
    /* -------------------------------------------------------------------------- */
    const kangkung = await prisma.product.create({
      data: {
        name: 'Kangkung',
        excerpt: 'Kangkung',
        description: 'Kangkung berkualitas tinggi',
        slug: 'kangkung',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622317/KANGKUNG-2_rntu5x.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622317/KANGKUNG-4_ezjze8.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622317/KANGKUNG-3_nx6jza.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622316/KANGKUNG-1_txjfkv.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622318/KANGKUNG-5_dokkby.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: kangkung.id,
        price: 12000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: kangkung.id,
        categoryId: sayurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK JERUK                                */
    /* -------------------------------------------------------------------------- */
    const jeruk = await prisma.product.create({
      data: {
        name: 'Jeruk',
        excerpt: 'Jeruk',
        description: 'Jeruk berkualitas tinggi',
        slug: 'jeruk',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622505/JERUK-2_jfo4hf.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622505/JERUK-5_uxd1yy.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622505/JERUK-4_fwhraw.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622505/JERUK-1_hvpw3d.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622505/JERUK-3_egiko3.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: jeruk.id,
        price: 14000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: jeruk.id,
        categoryId: buahCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK PISANG                               */
    /* -------------------------------------------------------------------------- */
    const pisang = await prisma.product.create({
      data: {
        name: 'Pisang',
        excerpt: 'Pisang',
        description: 'Pisang berkualitas tinggi',
        slug: 'pisang',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622600/PISANG-4_i78bqi.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622600/PISANG-5_ubdyt0.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622599/PISANG-1_xfgkb5.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622599/PISANG-3_ecdy1w.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622599/PISANG-2_ypfquf.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: pisang.id,
        price: 6000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: pisang.id,
        categoryId: buahCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK ANGGUR                               */
    /* -------------------------------------------------------------------------- */
    const anggur = await prisma.product.create({
      data: {
        name: 'Anggur',
        excerpt: 'Anggur',
        description: 'Anggur berkualitas tinggi',
        slug: 'anggur',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622720/ANGGUR-5_csyf1d.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622719/ANGGUR-4_neay8u.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622720/ANGGUR-2_injuon.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622719/ANGGUR-3_cgobd9.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622719/ANGGUR-1_ugrzjm.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: anggur.id,
        price: 8000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: anggur.id,
        categoryId: buahCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                 PRODUK APEL                                */
    /* -------------------------------------------------------------------------- */
    const apel = await prisma.product.create({
      data: {
        name: 'Apel',
        excerpt: 'Apel',
        description: 'Apel berkualitas tinggi',
        slug: 'apel',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622803/APEL-4_eexeqf.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622804/APEL-5_rmxora.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622802/APEL-2_ymjjkv.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622802/APEL-3_tx7u9k.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622801/APEL-1_gtiokg.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: apel.id,
        price: 10000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: apel.id,
        categoryId: buahCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                 PRODUK TARO                                */
    /* -------------------------------------------------------------------------- */
    const taro = await prisma.product.create({
      data: {
        name: 'Taro',
        excerpt: 'Taro',
        description: 'Taro berkualitas tinggi',
        slug: 'taro',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622948/TARO-5_zo5qko.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622946/TARO-4_qyyvdo.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622945/TARO-1_rydbf1.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622945/TARO-3_mgn6f4.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744622945/TARO-2_qpo7eb.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: taro.id,
        price: 12000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: taro.id,
        categoryId: makananRinganCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK QTELA                                */
    /* -------------------------------------------------------------------------- */
    const qtela = await prisma.product.create({
      data: {
        name: 'Qtela',
        excerpt: 'Qtela',
        description: 'Qtela berkualitas tinggi',
        slug: 'qtela',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623090/QTELA-5_m40vhv.png',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623086/QTELA-4_drssed.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623085/QTELA-3_ubu638.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623085/QTELA-2_z2moqi.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623084/QTELA-1_puo9uy.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: qtela.id,
        price: 14000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: qtela.id,
        categoryId: makananRinganCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK NABATI                                */
    /* -------------------------------------------------------------------------- */
    const nabati = await prisma.product.create({
      data: {
        name: 'Nabati',
        excerpt: 'Nabati',
        description: 'Nabati berkualitas tinggi',
        slug: 'nabati',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623203/NABATI-5_f0ondo.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623202/NABATI-4_u9no55.webp',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623202/NABATI-2_bhq2wh.png',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623202/NABATI-1_mlcn4l.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623202/NABATI-3_aus6ei.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: nabati.id,
        price: 6000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: nabati.id,
        categoryId: makananRinganCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                 PRODUK OREO                                */
    /* -------------------------------------------------------------------------- */
    const oreo = await prisma.product.create({
      data: {
        name: 'Oreo',
        excerpt: 'Oreo',
        description: 'Oreo berkualitas tinggi',
        slug: 'oreo',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623321/OREO-4_wjpphg.png',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623319/OREO-3_df17gk.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623317/OREO-2_k0upy7.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623316/OREO-1_qpvivt.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623384/OREO-5_bmbise.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: oreo.id,
        price: 8000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: oreo.id,
        categoryId: makananRinganCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                              PRODUK TEH BOTOL                              */
    /* -------------------------------------------------------------------------- */
    const teh_botol = await prisma.product.create({
      data: {
        name: 'Teh Botol',
        excerpt: 'Teh Botol',
        description: 'Teh Botol berkualitas tinggi',
        slug: 'teh-botol',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623496/TEH-BOTOL-5_qitoq0.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623495/TEH-BOTOL-4_aibb0m.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623495/TEH-BOTOL-2_q3mlsv.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623495/TEH-BOTOL-3_rb3qa4.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623494/TEH-BOTOL-1_yemy8l.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: teh_botol.id,
        price: 10000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: teh_botol.id,
        categoryId: minumanCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                              PRODUK JUS MANGGA                             */
    /* -------------------------------------------------------------------------- */
    const jus_mangga = await prisma.product.create({
      data: {
        name: 'Jus Mangga',
        excerpt: 'Jus Mangga',
        description: 'Jus Mangga berkualitas tinggi',
        slug: 'jus-mangga',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623639/JUS-MANGGA-5_vyfs8v.png',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623636/JUS-MANGGA-2_n8uewd.png',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623636/JUS-MANGGA-4_psmonj.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623636/JUS-MANGGA-3_owab7g.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623636/JUS-MANGGA-1_p3r6jb.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: jus_mangga.id,
        price: 12000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: jus_mangga.id,
        categoryId: minumanCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                               PRODUK SUSU UHT                              */
    /* -------------------------------------------------------------------------- */
    const susu_uht = await prisma.product.create({
      data: {
        name: 'Susu UHT',
        excerpt: 'Susu UHT',
        description: 'Susu UHT berkualitas tinggi',
        slug: 'susu-uht',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623851/SUSU-UHT-5_wuobmi.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623851/SUSU-UHT-1_n20bk6.png',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623851/SUSU-UHT-4_d0naui.webp',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623851/SUSU-UHT-3_kosom9.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744623850/SUSU-UHT-2_l63shx.png',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: susu_uht.id,
        price: 14000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: susu_uht.id,
        categoryId: minumanCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                             PRODUK KOPI INSTAN                             */
    /* -------------------------------------------------------------------------- */
    const kopi_instan = await prisma.product.create({
      data: {
        name: 'Kopi Instan',
        excerpt: 'Kopi Instan',
        description: 'Kopi Instan berkualitas tinggi',
        slug: 'kopi-instan',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624116/NESCAFE-2_cwhhlo.png',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624116/NESCAFE-4_pesqsh.png',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624116/NESCAFE-5_v7ewov.png',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624116/NESCAFE-1_c4lmtw.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624116/NESCAFE-3_k5jgo4.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: kopi_instan.id,
        price: 6000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: kopi_instan.id,
        categoryId: minumanCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                              PRODUK PASTA GIGI                             */
    /* -------------------------------------------------------------------------- */
    const pasta_gigi = await prisma.product.create({
      data: {
        name: 'Pasta Gigi',
        excerpt: 'Pasta Gigi',
        description: 'Pasta Gigi berkualitas tinggi',
        slug: 'pasta-gigi',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624298/PEPSODENT-1_hcfm1w.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624298/PEPSODENT-4_yvhkiq.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624298/PEPSODENT-5_m3jx6q.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624298/PEPSODENT-2_qeqw00.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624298/PEPSODENT-2_ev1keg.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: pasta_gigi.id,
        price: 8000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: pasta_gigi.id,
        categoryId: peralatanMandiCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK SHAMPO                               */
    /* -------------------------------------------------------------------------- */
    const shampo = await prisma.product.create({
      data: {
        name: 'Shampo Pantene',
        excerpt: 'Shampo',
        description: 'Shampo berkualitas tinggi',
        slug: 'shampo',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624437/PANTENE-2_x5w2rg.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624437/PANTENE-1_viqntu.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624436/PANTENE-5_ai9pwd.png',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624436/PANTENE-4_iz3usk.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624436/PANTENE-3_agnsc1.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: shampo.id,
        price: 10000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: shampo.id,
        categoryId: peralatanMandiCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                              PRODUK TISU BASAH                             */
    /* -------------------------------------------------------------------------- */
    const tisu_basah = await prisma.product.create({
      data: {
        name: 'Tisu Basah',
        excerpt: 'Tisu Basah',
        description: 'Tisu Basah berkualitas tinggi',
        slug: 'tisu-basah',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624592/MITU-5_i6atxf.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624591/MITU-4_fmvypq.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624591/MITU-3_iyklb5.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624591/MITU-1_dzruj7.png',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744624591/MITU-2_fj1jzq.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: tisu_basah.id,
        price: 12000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: tisu_basah.id,
        categoryId: peralatanMandiCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                           PRODUK SABUN CUCI MUKA                           */
    /* -------------------------------------------------------------------------- */
    const sabun_cuci_muka = await prisma.product.create({
      data: {
        name: 'KAHF Cuci Muka',
        excerpt: 'Sabun Cuci Muka',
        description: 'Sabun Cuci Muka berkualitas tinggi',
        slug: 'sabun-cuci-muka',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625607/KAHF-1_aij2nk.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625607/KAHF-4_kn0rn2.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625606/KAHF-5_f3v2so.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625606/KAHF-3_vu8amb.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625606/KAHF-2_rekrue.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: sabun_cuci_muka.id,
        price: 14000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: sabun_cuci_muka.id,
        categoryId: peralatanMandiCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK WAJAN                                */
    /* -------------------------------------------------------------------------- */
    const wajan = await prisma.product.create({
      data: {
        name: 'Wajan',
        excerpt: 'Wajan',
        description: 'Wajan berkualitas tinggi',
        slug: 'wajan',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625765/WAJAN-4_tpj16t.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625765/WAJAN-5_c1esnk.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625765/WAJAN-2_qm1kaf.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625765/WAJAN-3_dpenou.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625765/WAJAN-1_m6bqad.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: wajan.id,
        price: 200000,
        stock: 100,
        isCheap: false,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: wajan.id,
        categoryId: peralatanDapurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                               PRODUK SPATULA                               */
    /* -------------------------------------------------------------------------- */
    const spatula = await prisma.product.create({
      data: {
        name: 'Spatula',
        excerpt: 'Spatula',
        description: 'Spatula berkualitas tinggi',
        slug: 'spatula',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625869/SPATULA-1_fyhsua.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625869/SPATULA-5_hwxbnw.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625869/SPATULA-5_hwxbnw.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625869/SPATULA-5_hwxbnw.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744625869/SPATULA-5_hwxbnw.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: spatula.id,
        price: 60000,
        stock: 100,
        isCheap: false,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: spatula.id,
        categoryId: peralatanDapurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                               PRODUK SARINGAN                              */
    /* -------------------------------------------------------------------------- */
    const saringan = await prisma.product.create({
      data: {
        name: 'Saringan',
        excerpt: 'Saringan',
        description: 'Saringan berkualitas tinggi',
        slug: 'saringan',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744627235/SARINGAN-DAPUR-4_ojv06h.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744627235/SARINGAN-DAPUR-5_rzk1zf.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744627235/SARINGAN-DAPUR-3_vrmt41.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744627235/SARINGAN-DAPUR-2_oddcjx.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744627234/SARINGAN-DAPUR-1_b4uuyr.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: saringan.id,
        price: 100000,
        stock: 100,
        isCheap: false,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: saringan.id,
        categoryId: peralatanDapurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                           PRODUK KOMPOR PORTABLE                           */
    /* -------------------------------------------------------------------------- */
    const kompor_portable = await prisma.product.create({
      data: {
        name: 'Kompor Portable',
        excerpt: 'Kompor Portable',
        description: 'Kompor Portable berkualitas tinggi',
        slug: 'kompor-portable',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744627407/KOMPOR-2_cqtf8a.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744627406/KOMPOR-1_c8hyoj.png',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744627406/KOMPOR-3_jmezjf.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744627406/KOMPOR-5_f3ugf2.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1744627405/KOMPOR-4_s5kuuh.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: kompor_portable.id,
        price: 300000,
        stock: 100,
        isCheap: false,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: kompor_portable.id,
        categoryId: peralatanDapurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Address Seed                              */
    /* -------------------------------------------------------------------------- */
    const customerAddress = await prisma.address.create({
      data: {
        userId: customer1.id,
        street: 'Jl. Danukusuman Bremoro',
        city: 'Solo',
        number: 123,
        postalCode: 12540,
        country: 'Indonesia',
        isPrimary: true,
        isActive: true,
        latitude: -7.583492049994404,
        longitude: 110.82192815522832,
        // LOKASI DI RUMAH SOLO
      },
    });

    await prisma.address.create({
      data: {
        userId: customer1.id,
        street: 'Jl. Pondok Indah Mall',
        city: 'Jakarta',
        number: 456,
        postalCode: 12540,
        country: 'Indonesia',
        isPrimary: false,
        isActive: true,
        latitude: -6.265331596523745,
        longitude: 106.78302107893319,
        // LOKASI DI PONDOK INDAH
      },
    });

    await prisma.address.create({
      data: {
        userId: customer1.id,
        street: 'Jl. Zeni',
        city: 'Jakarta Timur',
        number: 789,
        postalCode: 12555,
        country: 'Indonesia',
        isPrimary: false,
        isActive: true,
        latitude: -6.250244221295454,
        longitude: 106.91423422703144,
        // LOKASI DI KODAM
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Cart Seed                                 */
    /* -------------------------------------------------------------------------- */
    const customerCart = await prisma.cart.create({
      data: {
        userId: customer1.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  CartItem Seed                             */
    /* -------------------------------------------------------------------------- */
    // Ambil storeProduct terkait
    const tomatStoreProduct = await prisma.storeProduct.findFirst({
      where: {
        productId: tomat.id,
        storeId: store1.id,
      },
    });

    const sabunStoreProduct = await prisma.storeProduct.findFirst({
      where: {
        productId: sabunMandi.id,
        storeId: store1.id,
      },
    });

    const jerukStoreProduct = await prisma.storeProduct.findFirst({
      where: {
        productId: jeruk.id,
        storeId: store1.id,
      },
    });

    // Tambahkan ke cart Salsabila (semua dari store1)
    const cartItemsData = [
      {
        product: tomat,
        storeProduct: tomatStoreProduct,
        quantity: 2,
      },
      {
        product: sabunMandi,
        storeProduct: sabunStoreProduct,
        quantity: 1,
      },
      {
        product: jeruk,
        storeProduct: jerukStoreProduct,
        quantity: 3,
      },
    ];

    for (const item of cartItemsData) {
      if (item.storeProduct) {
        await prisma.cartItem.create({
          data: {
            cartId: customerCart.id,
            storeProductId: item.storeProduct.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.storeProduct.price,
            total: Number(item.storeProduct.price) * item.quantity,
          },
        });
      }
    }

    /* -------------------------------------------------------------------------- */
    /*                                  Voucher Seed                              */
    /* -------------------------------------------------------------------------- */
    const voucher1 = await prisma.voucher.create({
      data: {
        name: 'Diskon 90%',
        description: 'Dapatkan diskon 90% pada semua produk',
        code: 'DISKON90',
        stockVoucherAdmin: 100,
        voucherCategory: VoucherCategory.SHOPPING_RESULT,
        voucherType: VoucherType.PERCENTAGE,
        value: 90,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        isActive: true,
        minPurchase: 100,
        maxPriceReduction: 100000000,
        voucherImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627187/film_event_mzciww.jpg',
      },
    });

    const voucher2 = await prisma.voucher.create({
      data: {
        name: 'Diskon 1000 rupiah',
        description: 'Dapatkan diskon 1000 rupiah',
        code: 'DISKONBELANJA1000',
        stockVoucherAdmin: 100,
        voucherCategory: VoucherCategory.SHOPPING_RESULT,
        voucherType: VoucherType.AMOUNT,
        value: 1000,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        isActive: true,
        minPurchase: 100,
        maxPriceReduction: 1000000,
        voucherImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627191/tech_hrqpsd.jpg',
      },
    });

    const voucher3 = await prisma.voucher.create({
      data: {
        name: 'Diskon Ongkir 1000 rupiah',
        description: 'Dapatkan diskon 1000 rupiah untuk ongkos kirim',
        code: 'DISKON1000',
        stockVoucherAdmin: 100,
        voucherCategory: VoucherCategory.SHIPPING_COST,
        voucherType: VoucherType.AMOUNT,
        value: 1000,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        isActive: true,
        minPurchase: 100,
        maxPriceReduction: 1000000,
        voucherImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627191/tech_hrqpsd.jpg',
      },
    });

    const voucher4 = await prisma.voucher.create({
      data: {
        name: 'Diskon tomat 1000 rupiah',
        description: 'Dapatkan diskon 1000 rupiah untuk produk tomat',
        code: 'DISKONTOMAT1000',
        stockVoucherAdmin: 100,
        voucherCategory: VoucherCategory.PRODUCT,
        voucherType: VoucherType.AMOUNT,
        value: 1000,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        isActive: true,
        minPurchase: 100,
        maxPriceReduction: 1000000,
        voucherImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627189/health-workshop_zns6qb.jpg',
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                          VOUCHER UNTUK PRODUK AJA                          */
    /* -------------------------------------------------------------------------- */

    await prisma.voucherProduct.create({
      data: {
        voucherId: voucher4.id,
        productId: tomat.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                VOUCHER USER                                */
    /* -------------------------------------------------------------------------- */
    // CUSTOMER
    await prisma.voucherUser.create({
      data: {
        userId: customer1.id,
        voucherId: voucher1.id,
        stockCustomer: 2,
      },
    });

    await prisma.voucherUser.create({
      data: {
        userId: customer1.id,
        voucherId: voucher2.id,
        stockCustomer: 2,
      },
    });

    await prisma.voucherUser.create({
      data: {
        userId: customer1.id,
        voucherId: voucher3.id,
        stockCustomer: 2,
      },
    });

    await prisma.voucherUser.create({
      data: {
        userId: customer1.id,
        voucherId: voucher4.id,
        stockCustomer: 2,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Order Seed                                */
    /* -------------------------------------------------------------------------- */

    // ORDER PERTAMA FARREL

    const orderSiCustomerFarrel_one = await prisma.order.create({
      data: {
        userId: customer1.id,
        slug: 'ORDER-123',
        storeId: store1.id,
        shippingAddressId: customerAddress.id,
        totalAmount: 15000 + 69000,
        status: OrderStatus.PENDING_PAYMENT,
        paymentMethodType: PaymentMethodType.BANK_TRANSFER,
        paymentProof:
          'https://dummyimage.com/600x400/90ee90/fff&text=bukti+transfer',
        paymentProofUploadedAt: new Date(),
        orderConfirmationAt: new Date(),
        shippingInformation: {
          create: {
            courierName: 'JNE',
            code: 'JNE123456',
            serviceType: 'REGULER',
            description: 'JNE Reguler',
            shippingCost: 15000.0,
            estimatedTime: 3,
          },
        },
      },
    });

    const orderItemsFarrel_one = [
      {
        product: tomat,
        storeProduct: tomatStoreProduct,
        quantity: 20,
      },
      {
        product: sabunMandi,
        storeProduct: sabunStoreProduct,
        quantity: 20,
      },
      {
        product: jeruk,
        storeProduct: jerukStoreProduct,
        quantity: 20,
      },
    ];

    for (const item of orderItemsFarrel_one) {
      if (item.storeProduct) {
        await prisma.orderItem.create({
          data: {
            orderId: orderSiCustomerFarrel_one.id,
            productId: item.product.id,
            storeProductId: item.storeProduct.id,
            quantity: item.quantity,
            price: +item.storeProduct.price,
            total: Number(item.storeProduct.price) * item.quantity,
          },
        });
      }
    }

    // ORDER KEDUA FARREL

    const orderSiCustomerFarrel_two = await prisma.order.create({
      data: {
        userId: customer1.id,
        slug: 'ORDER-456',
        storeId: store1.id,
        shippingAddressId: customerAddress.id,
        totalAmount: 800000,
        status: OrderStatus.WAITING_FOR_PAYMENT,
        paymentMethodType: PaymentMethodType.BANK_TRANSFER,
        paymentProof: '',
        paymentProofUploadedAt: new Date(),
        orderConfirmationAt: new Date(),
        shippingInformation: {
          create: {
            courierName: 'JNE',
            code: 'JNE123456',
            serviceType: 'REGULER',
            description: 'JNE Reguler',
            shippingCost: 60000,
            estimatedTime: 3,
          },
        },
      },
    });

    const orderItemsFarrel_two = [
      {
        product: tomat,
        storeProduct: tomatStoreProduct,
        quantity: 10,
      },
      {
        product: sabunMandi,
        storeProduct: sabunStoreProduct,
        quantity: 10,
      },
      {
        product: jeruk,
        storeProduct: jerukStoreProduct,
        quantity: 10,
      },
    ];

    for (const item of orderItemsFarrel_two) {
      if (item.storeProduct) {
        await prisma.orderItem.create({
          data: {
            orderId: orderSiCustomerFarrel_two.id,
            productId: item.product.id,
            storeProductId: item.storeProduct.id,
            quantity: item.quantity,
            price: +item.storeProduct.price,
            total: Number(item.storeProduct.price) * item.quantity,
          },
        });
      }
    }

    /* -------------------------------------------------------------------------- */
    /*                                  Referral Seed                             */
    /* -------------------------------------------------------------------------- */
    await prisma.referral.create({
      data: {
        referredById: superadmin.id,
        referredUserId: customer1.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  ConfirmToken Seed                         */
    /* -------------------------------------------------------------------------- */
    await prisma.confirmToken.create({
      data: {
        userId: customer1.id,
        token: 'abcdef123456',
        expiredDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        used: false,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                DISCOUNT SEED                               */
    /* -------------------------------------------------------------------------- */

    const discount1 = await prisma.discount.create({
      data: {
        name: 'Diskon Tomat',
        type: 'PERCENTAGE',
        value: 10,
        priceBeforeDiscount: 10000,
        minPurchase: 50000,
        maxDiscount: 10000,
        expiredAt: new Date(new Date().setDate(new Date().getDate() + 30)),
        DiscountProduct: {
          create: {
            productId: tomat.id,
          },
        },
      },
    });

    await prisma.discount.create({
      data: {
        name: 'Diskon Semangka',
        type: 'AMOUNT',
        value: 5000,
        priceBeforeDiscount: 5000,
        minPurchase: 100000,
        maxDiscount: 10000,
        expiredAt: new Date(new Date().setDate(new Date().getDate() + 30)),
        DiscountProduct: {
          create: {
            productId: semangka.id,
          },
        },
      },
    });

    await prisma.discountReport.create({
      data: {
        discountId: discount1.id,
        userId: customer1.id,
      },
    });

    /* -------------------------------------------------------------------------- */

    console.info(`Penyisipan data berhasil 🌱`);
  } catch (error) {
    console.error(`Kesalahan penyisipan data: ${error.message}`);
  } finally {
    await prisma.$disconnect();
    console.info('Koneksi Prisma terputus.');
  }
}

main();
