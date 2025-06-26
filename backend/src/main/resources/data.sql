create database TechStoreDB
    character set utf8mb4
    collate utf8mb4_unicode_ci;

use techstoredb;


INSERT INTO category(name)
values ('Camera'), ('Laptop'), ('Keyboard'),
       ('PC'), ('SmartPhone'), ('Accessories'), ('Gamingtable'),
       ('Watch'), ('Ipad');

-- Role
INSERT INTO role (name)
VALUES ('ROLE_USER'),
       ('ROLE_ADMIN');
-- User
INSERT INTO user (name, date_of_birth, email, password, phone, address, role_id, is_active)
VALUES
    ('Nguyễn Văn An', '1995-04-20', 'a@gmail.com', '123456', '0900000001', 'Hà Nội', 1, 1),
    ('Trần Thị Tuyến', '1998-08-10', 'b@gmail.com', 'abcdef', '0900000002', 'Đà Nẵng',1,  1),
    ('Admin', '1990-01-01', 'admin@gmail.com', 'admin123', '0900000003', 'TP HCM', 2,  1);

-- Product
INSERT INTO product (name, description, price, stock_quantity, company_name,thumbnail, category_id)
VALUES
    ('Laptop Dell XPS 13', 'Màn hình 13.3 inch, chip Intel i7', 29999000, 10, 'Dell', '/images/dellxps13_silver.jpg',2),
    ('Camera Canon M50', 'Máy ảnh mirrorless 24MP', 15999000, 8, 'Canon','/images/canon-m50_black.jpg',1),
    ('Chuột Logitech M650', 'Chuột không dây Bluetooth', 1290000, 50, 'Logitech','/images/logitech-m650-white.jpg',6);



INSERT INTO product (name, description, price, stock_quantity, company_name, thumbnail,category_id)
VALUES
    ('Camera Hikvision DS-2CE76D0T-ITPFS', 'Camera dome 2MP, hỗ trợ hồng ngoại và thu âm.', 2000000, 10, 'Hikvision','/images/DS-2CE76D0T-ITPFS-3.jpg', 1),

    ('Camera Dahua HAC-HDW1200EMP-A', 'Camera 2MP hồng ngoại ban đêm, vỏ kim loại.', 1850000, 12, 'Dahua', '/images/DH-HAC-HDW1200EMP-A-SA.jpg', 1),

    ('Camera Ezviz C6N 1080p', 'Camera wifi quay quét, đàm thoại 2 chiều.', 990000, 15, 'Ezviz','/images/camera-ip-360-do-1080p-ezviz.jpg', 1),

    ('Camera Imou Ranger 2 4MP', 'Camera quay quét 360 độ, độ phân giải 4MP.', 1450000, 8, 'Imou','/images/camera-imou.jpg', 1),

    ('Camera KBVision KX-C2004CA', 'Camera thân 2MP, chống nước IP67.', 1750000, 9, 'KBVision','/images/camera-kbvision.jpg', 1),

    ('Camera Yoosee YS1600 2.0MP', 'Camera giá rẻ, hỗ trợ cloud, kết nối wifi.', 790000, 20, 'Yoosee','/images/camera-y1600.jpg', 1),

    ('Camera GoPro Hero 11 Black', 'Camera hành trình chuyên dụng chống nước, quay 5.3K.', 11500000, 5, 'GoPro','/images/gopro-11.jpeg', 1),

    ('Camera Sony Alpha ZV-E10', 'Máy ảnh quay vlog chuyên nghiệp, cảm biến APS-C.', 18900000, 3, 'Sony','/images/sony-zv-e10-lens-16-50mm-f35-56-black-1.jpg', 1);


INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
    ('Trắng', 'M', 50, 4);
-- laptop dell xps13
INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
    ('Ghi', '14.6 inch', 10, 2);
-- Camera Canon
INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
    ('Đen', 'Body only', 8, 3);

-- Camera 1: Hikvision DS-2CE76D0T-ITPFS (product_id = 5)
INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Trắng', 'Dome', 5, 5),
                                                                          ('Đen', 'Dome', 5, 5);

-- Camera 2: Dahua HAC-HDW1200EMP-A (product_id = 6)
INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Trắng', 'Thân', 7, 6),
                                                                          ('Đen', 'Thân', 5, 6);

-- Camera 3: Ezviz C6N (product_id = 7)
INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Trắng', 'Quay 360', 10, 7),
                                                                          ('Đen', 'Quay 360', 5, 7);

-- Camera 4: Imou Ranger 2 (product_id = 8)
INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Trắng', '4MP', 6, 8),
                                                                          ('Xám', '4MP', 2, 8);

-- Camera 5: KBVision KX-C2004CA (product_id = 9)
INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Trắng', 'Thân dài', 6, 9),
                                                                          ('Đen', 'Thân dài', 3, 9);

-- Camera 6: Yoosee YS1600 (product_id = 10)
INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Trắng', 'Mini', 12, 10),
                                                                          ('Đen', 'Mini', 8, 10);

-- Camera 7: GoPro Hero 11 Black (product_id = 11)
INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Đen', 'Standard', 3, 11),
                                                                          ('Xám', 'Max Lens', 2, 11);

-- Camera 8: Sony Alpha ZV-E10 (product_id = 12)
INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Đen', 'Body only', 2, 12),
                                                                          ('Trắng', 'Kit 16-50mm', 1, 12);


-- INSERT INTO product: 8 Laptops
INSERT INTO product ( name, description, price, stock_quantity, company_name, thumbnail, category_id) VALUES
                                                                                                          ('MacBook Air M2 13"', 'Laptop mỏng nhẹ hiệu suất cao, chip Apple M2.', 28000000, 10, 'Apple', '/images/macbook-air-m2.jpg', 2),
                                                                                                          ('Dell XPS 13 Plus', 'Laptop cao cấp, thiết kế viền siêu mỏng, màn hình OLED.', 32000000, 8, 'Dell', '/images/Dell-xps-13-plus.jpg', 2),
                                                                                                          ( 'Asus ROG Zephyrus G14', 'Laptop gaming mạnh mẽ với card RTX và màn hình 144Hz.', 35000000, 6, 'Asus', '/images/G14_edited1.webp', 2),
                                                                                                          ( 'HP Spectre x360', 'Laptop 2-in-1 cao cấp, xoay gập cảm ứng.', 27000000, 7, 'HP', '/images/cbv-1280x720-1.jpg', 2),
                                                                                                          ('Lenovo Yoga Slim 7i', 'Laptop mỏng nhẹ dành cho doanh nhân.', 25000000, 9, 'Lenovo', '/images/1-2.png', 2),
                                                                                                          ('Acer Swift X 14', 'Laptop đồ họa phổ thông, cấu hình tốt.', 22000000, 12, 'Acer', '/images/Acer-Swift-X-14-02.jpg', 2),
                                                                                                          ('MSI Modern 14', 'Laptop học tập, làm việc cơ bản, giá hợp lý.', 18000000, 15, 'MSI', '/images/10072_21921_laptop_msi_modern_14_b5m_203vn_1.jpg', 2),
                                                                                                          ('Gigabyte AERO 16 OLED', 'Laptop thiết kế đồ hoạ cao cấp với màn hình OLED.', 40000000, 4, 'Gigabyte', '/images/gigabyte-aero-16-oled-thinkpro-01-thinkpro.png', 2);

-- INSERT INTO product_variant: 2 biến thể mỗi laptop
INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
-- MacBook Air M2 13"
('Xám', '8GB RAM / 256GB SSD', 5, 13),
('Bạc', '16GB RAM / 512GB SSD', 5, 13),

-- Dell XPS 13 Plus
('Bạc', '16GB / 512GB OLED', 4, 14),
('Đen', '32GB / 1TB OLED', 4, 14),

-- Asus ROG Zephyrus G14
('Trắng', '16GB / 512GB RTX 4060', 3, 15),
('Xám', '32GB / 1TB RTX 4070', 3, 15),

-- HP Spectre x360
('Đen', '16GB / 512GB', 4, 16),
('Xanh', '16GB / 1TB', 3, 16),

-- Lenovo Yoga Slim 7i
('Xám', '16GB / 512GB', 6, 17),
('Tím', '16GB / 1TB', 3, 17),

-- Acer Swift X 14
('Bạc', '16GB / 512GB', 6, 18),
('Xanh', '16GB / 1TB', 6, 18),

-- MSI Modern 14
('Đen', '8GB / 512GB', 7, 19),
('Trắng', '16GB / 512GB', 8, 19),

-- Gigabyte AERO 16 OLED
('Đen', '32GB / 1TB OLED', 2, 20),
('Bạc', '64GB / 2TB OLED', 2, 20);

-- INSERT INTO product: 8 Keyboards
INSERT INTO product (name, description, price, stock_quantity, company_name, thumbnail, category_id) VALUES
                                                                                                         ('Logitech G Pro X', 'Bàn phím cơ gaming hot swap, keycap chất lượng cao.', 2900000, 10, 'Logitech', '/images/1_5b2f7891bf434a7aab9f1abdba56c17e.webp', 3),
                                                                                                         ('Razer Huntsman V2', 'Bàn phím cơ Razer switch quang học, RGB siêu sáng.', 3200000, 8, 'Razer', '/images/ban-phim-co-razer-huntsman-v2-pubg-1.jpg', 3),
                                                                                                         ('Keychron K2 V2', 'Bàn phím cơ không dây, layout 75%, hỗ trợ macOS.', 2200000, 12, 'Keychron', '/images/carbon-black-led-rgb-hotswap-keychron-k-pro-2.webp', 3),
                                                                                                         ('DareU EK87', 'Bàn phím cơ tầm trung, switch D, đèn nền LED.', 850000, 14, 'DareU', '/images/8178_11763.png', 3),
                                                                                                         ( 'Akko 3068B Plus', 'Bàn phím Bluetooth 5.0, 68 phím, hot swap.', 1900000, 9, 'Akko', '/images/ban-phim-co-akko-3068b-plus-blue-on-white-001.jpg', 3),
                                                                                                         ( 'Corsair K70 RGB MK.2', 'Bàn phím gaming cao cấp, switch Cherry MX.', 3500000, 6, 'Corsair', '/images/keyboard_corsair_k70_rgb_mk_2_mechanical_cherry_mx_red_0000_1.jpg', 3),
                                                                                                         ( 'SteelSeries Apex Pro', 'Bàn phím OLED hiển thị tùy biến, RGB đẹp mắt.', 4100000, 5, 'SteelSeries', '/images/17186-b--n-ph--m-c---steelseries-apex-pro-tkl.jpg', 3),
                                                                                                         ('Fuhlen L87s RGB', 'Bàn phím cơ giá rẻ, thiết kế tenkeyless.', 700000, 20, 'Fuhlen', '/images/KIT-Fuhlen-H87s-RGB.jpg', 3);

-- INSERT INTO product_variant: 2 biến thể mỗi keyboard
INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
-- Logitech G Pro X
('Đen', 'Red Switch', 5, 29),
('Trắng', 'Blue Switch', 5, 29),

-- Razer Huntsman V2
('Đen', 'Linear Optical', 4, 30),
('Trắng', 'Clicky Optical', 4, 30),

-- Keychron K2 V2
('Xám cam', 'Gateron Red', 6, 31),
('Carbon', 'Gateron Brown', 6, 31),

-- DareU EK87
('Hồng', 'Brown Switch', 7, 32),
('Trắng', 'Red Switch', 7, 32),

-- Akko 3068B Plus
('Hồng', 'Akko Cream Yellow', 4, 33),
('Đen cam', 'Akko CS Lavender', 5, 33),

-- Corsair K70 RGB MK.2
('Đen', 'Cherry MX Red', 3, 34),
('Trắng', 'Cherry MX Blue', 3, 34),

-- SteelSeries Apex Pro
('Đen', 'OmniPoint Adjustable', 2, 35),
('Trắng', 'OmniPoint Adjustable', 3, 35),

-- Fuhlen L87s RGB
('Đen', 'Blue Switch', 10, 36),
('Xám', 'Red Switch', 10, 36);

INSERT INTO product (name, description, price, stock_quantity, company_name, thumbnail, category_id) VALUES
                                                                                                         ('PC Gaming ASUS ROG Strix G15', 'PC gaming cấu hình mạnh mẽ, CPU Ryzen 7, RTX 3070, RAM 16GB.', 36000000, 5, 'ASUS', '/images/71QoX3wVLZL.jpg', 4),
                                                                                                         ('PC Dell XPS Tower', 'Máy tính văn phòng cao cấp, i7-13700, RAM 32GB, SSD 1TB.', 29000000, 6, 'Dell', '/images/desktop-tower-xps-pdp-magnum-polaris.webp', 4),
                                                                                                         ('PC HP Omen 30L', 'PC gaming HP với RTX 3080, RAM 32GB, tản nhiệt nước.', 45000000, 4, 'HP', '/images/hp-omen-30l-gaming-core-i9-11900kf-vga-rtx-3060-12gr6-dr4-32g-rgb-led-o-nvme-512g-hdd-2tbjpg.jpg', 4),
                                                                                                         ('PC MSI MAG Infinite', 'PC chơi game RTX 3060, i5-12400F, SSD 512GB.', 25000000, 8, 'MSI', '/images/Infinite-10TH-1.jpg', 4),
                                                                                                         ('PC Lenovo Legion T5', 'PC đa dụng, Ryzen 5, GTX 1660S, RAM 16GB.', 22000000, 9, 'Lenovo', '/images/71VQGgC81fL.jpg', 4),
                                                                                                         ('PC Gigabyte AORUS', 'Máy tính custom cao cấp, tản nhiệt nước, RGB full.', 48000000, 3, 'Gigabyte', '/images/Case-May-Tinh-Gigabyte-Aorus-C500-Glass-4.jpg', 4),
                                                                                                         ('PC Acer Predator Orion 3000', 'Gaming PC gọn nhẹ, Core i7, RTX 4060.', 32000000, 7, 'Acer', '/images/3k1.jpg', 4),
                                                                                                         ('PC Intel NUC 11', 'Mini PC cỡ nhỏ cho làm việc & giải trí.', 18000000, 10, 'Intel', '/images/61dH7gZc3JL.jpg', 4);

INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Đen', 'ATX', 3, 37), ('Trắng', 'Micro-ATX', 2, 37),
                                                                          ('Xám', 'Mini Tower', 3, 38), ('Bạc', 'Mid Tower', 3, 38),
                                                                          ('Đen', 'Full Tower', 2, 39), ('Xanh', 'Mid Tower', 2, 39),
                                                                          ('Đen', 'ATX', 4, 40), ('Trắng', 'Mini-ITX', 4, 40),
                                                                          ('Xám', 'Micro-ATX', 5, 41), ('Đen', 'ATX', 4, 41),
                                                                          ('Đen', 'Mid Tower', 2, 42), ('RGB', 'Full Tower', 1, 42),
                                                                          ('Đen', 'ATX', 3, 43), ('Trắng', 'Micro-ATX', 4, 43),
                                                                          ('Đen', 'Mini', 6, 44), ('Bạc', 'NUC', 4, 44);


INSERT INTO product (name, description, price, stock_quantity, company_name, thumbnail, category_id) VALUES
                                                                                                         ('Galaxy S25 Ultra', 'Samsung S25 Ultra mạnh mẽ với chip Snapdragon 8 Elite For Galaxy mới nhất, RAM 12GB và bộ nhớ trong 256GB-1TB. Hệ thống 3 camera sau chất lượng gồm camera chính 200MP,
	camera tele 50MP và camera góc siêu rộng 50MP. Thiết kế kính cường lực Corning Gorilla Armor 2 và khung viền Titanium, màn hình Dynamic AMOLED 6.9 inch. Điện thoại này còn có viên pin 5000mAh, hỗ trợ 5G và Galaxy AI ấn tượng, nâng cao trải nghiệm người dùng!', 33990000, 19, 'Samsung', '/images/e4849447-008c-4615-b987-263e9dae6e3c_galaxy_s25_ultra_black.jpg', 5),
                                                                                                         ('iPhone 15 Pro Max', 'Điện thoại flagship từ Apple, chip A17 Pro, camera 48MP.', 34990000, 10, 'Apple', '/images/2024_4_16_638488768365442895_6.webp', 5),
                                                                                                         ('Galaxy S25', 'Smartphone cao cấp của Samsung, camera zoom 100X, S-Pen.', 32990000, 8, 'Samsung', '/images/250123044938-s25-plusxb.webp', 5),
                                                                                                         ('Galaxy A56', 'Smartphone cao cấp của Samsung, camera zoom 100X, S-Pen.', 20990000, 8, 'Samsung', '/images/Galaxy-A56-mau-hong.jpg', 5),
                                                                                                         ('Xiaomi 14 Pro', 'Điện thoại cấu hình mạnh, sạc siêu nhanh 120W.', 18990000, 15, 'Xiaomi', '/images/(600x600)_crop_xiaomi-14-8gb-256gb-xtmobile.webp', 5),
                                                                                                         ('OPPO Find X6 Pro', 'Màn hình 2K AMOLED, camera Hasselblad cao cấp.', 20990000, 12, 'OPPO', '/images/oppo-find-x6-pro-1-600x600.jpg', 5),
                                                                                                         ('Vivo X90 Pro+', 'Camera ZEISS, Snapdragon 8 Gen 2, RAM 12GB.', 19990000, 9, 'Vivo', '/images/Vivo-X90-Pro-Plus_featured-image-packshot-review-1.jpg', 5),
                                                                                                         ('Realme GT Neo 5', 'Sạc nhanh 240W, giá hợp lý, hiệu năng cao.', 12990000, 14, 'Realme', '/images/2023_2_9_638115325056892438_realme-gt-neo-5-teaser.webp', 5),
                                                                                                         ('ASUS ROG Phone 7', 'Điện thoại gaming, tản nhiệt quạt rời, AMOLED 165Hz.', 26990000, 7, 'ASUS', '/images/Asus-ROG-Phone-7_-W_featured-image-packshot-review.jpg', 5);

INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Đen', '256GB', 5, 44), ('Titan Trắng', '512GB', 3, 44),
                                                                          ('Titan Xanh', '256GB', 5, 45), ('Titan Đen', '512GB', 3, 45),
                                                                          ('Đen Phantom', '256GB', 4, 46), ('Bạc', '512GB', 4, 46),
                                                                          ('Tím', '256GB', 7, 47), ('Đen', '512GB', 5, 47),
                                                                          ('Xanh Lá', '256GB', 6, 48), ('Đen', '512GB', 6, 48),
                                                                          ('Đỏ', '256GB', 4, 49), ('Bạc', '512GB', 5, 49),
                                                                          ('Trắng', '256GB', 7, 50), ('Đen', '512GB', 5, 50),
                                                                          ('Đen', '512GB', 3, 51), ('Xanh', '1TB', 3, 51),
                                                                          ('Đen', '256GB', 6, 52), ('Xanh biển', '512GB', 5, 52);


INSERT INTO product (name, description, price, stock_quantity, company_name, thumbnail, category_id) VALUES
-- Accessories (category_id = 6)
('Tai nghe AirPods Pro 2', 'Chống ồn chủ động, chip H2.', 5490000, 20, 'Apple', '/images/airpods-pro-2-hero-select-202409_FMT_WHH.jfif', 6),
('Sạc nhanh 20W Apple', 'Sạc nhanh iPhone/iPad.', 490000, 50, 'Apple', '/images/list-new-127.jpg', 6),
('Cáp USB-C to Lightning', 'Chuẩn MFI, độ bền cao.', 390000, 40, 'Anker', '/images/cap-sac-nhanh-iphone-type-c-sang-lightning-1.jpeg', 6),
('Chuột Logitech MX Master 3S', 'Chuột không dây cao cấp, thiết kế công thái học.', 1990000, 13, 'Logitech', '/images/mx-master-3s-mouse-top-side.webp', 6),
('Bàn phím Keychron K2', 'Switch Gateron, kết nối không dây.', 2290000, 15, 'Keychron', '/images/Bàn-Phím-Cơ-KEYCHRON-K2-bản-nhôm-Led-RGB1.jpeg', 6),

-- Gamingtable (category_id = 7)
('Bàn gaming E-Dra EGT1650', 'Khung kim loại, mặt bàn carbon, đèn RGB.', 3490000, 5, 'E-Dra', '/images/Bàn-gaming-E-DRA-EGT1460R-Blade-RGB_jpg-(1).jpg', 7),
('Bàn gaming Razer Desk', 'Thiết kế Razer chính hãng, chống nước.', 4990000, 4, 'Razer', '/images/ban-gaming-fufutech-x-razer-5-5510.jpg', 7),
('Bàn gaming Xigmatek Aries S', 'Mặt kính cường lực, khung thép chắc chắn.', 2890000, 6, 'Xigmatek', '/images/11_e4b7ddcfc55f42599e73b05ce96b420c_72314dcf3bd24e209c240b606d9ee7e6.webp', 7),
('Bàn gaming ZDesk ZD111', 'Đèn LED RGB viền, mặt bàn rộng.', 3190000, 7, 'ZDesk', '/images/5708d6e2089fecc1b58e.jpg', 7),
('Bàn gaming Warrior WGT202', 'Khung chữ Z, lưới chắn cáp, chân chống trượt.', 2590000, 8, 'Warrior', '/images/warrior-pawn-series-wgt202-ava-scaled_0935fab059a24a7ba8d69078078b4288_57876644bd0c4b2d92f424590e4c6cf0_1024x1024.webp', 7),

-- Watch (category_id = 8)
('Apple Watch Series 9', 'Màn hình sáng hơn, cảm biến nhiệt độ, chip S9.', 11990000, 7, 'Apple', '/images/3_cae3c290c1304ada9b5dbb1c72748027_4a963c3f875a44c9b0aa57d35edf4c86.jpg', 8),
('Samsung Galaxy Watch 6', 'Màn hình AMOLED, đo ECG, theo dõi giấc ngủ.', 8990000, 10, 'Samsung', '/images/samsung-galaxy-watch6-40mm-vang-1-750x500.jpg', 8),
('Garmin Venu 2', 'Theo dõi sức khỏe chuyên sâu, pin lâu.', 8490000, 6, 'Garmin', '/images/garmin-venu-2-plus-trang_58ff85ee082a430d8385d0366635815c_grande.webp', 8),
('Huawei Watch GT 3 Pro', 'Thiết kế sang trọng, pin 14 ngày.', 7490000, 8, 'Huawei', '/images/gt3-pr.webp', 8),
('Xiaomi Watch S1 Active', 'Giá rẻ, nhiều tính năng thể thao.', 3990000, 11, 'Xiaomi', '/images/b15c7addc62c447ef66e57bc4.png', 8),

-- Ipad (category_id = 9)
('iPad Pro M2 11 inch', 'Chip Apple M2, màn hình Liquid Retina, hỗ trợ Apple Pencil 2.', 23990000, 10, 'Apple', '/images/ipad-pro-11-inch-m2-1.png', 9),
('iPad Air 5 M1', 'Mỏng nhẹ, hiệu năng mạnh mẽ với chip M1.', 16990000, 8, 'Apple', '/images/ipad-air-5-m1-tim-1_046a20b4e06f48778fa23612baf48636_master.webp', 9),
('iPad Gen 9', 'Phù hợp học online, giải trí cơ bản.', 7990000, 15, 'Apple', '/images/7KU7jvH67d_1686305984.jpg', 9),
('iPad Mini 6', 'Kích thước nhỏ gọn, hỗ trợ Apple Pencil.', 13990000, 9, 'Apple', '/images/ipad-mini-6-glr-1.jpg', 9),
('iPad 10th Gen', 'Thiết kế mới, USB-C, chip A14 Bionic.', 10990000, 12, 'Apple', '/images/apple-ipad-10th-gen-display.webp', 9);

INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
-- Accessories (product_id 53-57)
('Trắng', 'Nhỏ', 10, 53), ('Đen', 'Nhỏ', 10, 53),
('Trắng', 'Nhỏ', 25, 54), ('Xám', 'Nhỏ', 25, 54),
('Trắng', '1m', 20, 55), ('Đen', '1m', 20, 55),
('Đen', 'Chuẩn', 7, 56), ('Xám', 'Chuẩn', 6, 56),
('Đen', '75%', 8, 57), ('Xám', 'Full', 7, 57),

-- Gamingtable (product_id 58-62)
('Đen', '120cm', 3, 58), ('Đen', '140cm', 2, 58),
('Đen', '120cm', 2, 59), ('Đen', '160cm', 2, 59),
('Đen', '120cm', 3, 60), ('Đỏ', '120cm', 3, 60),
('Đen', '140cm', 4, 61), ('Xanh', '140cm', 3, 61),
('Đen', '120cm', 5, 62), ('Đỏ', '140cm', 3, 62),

-- Watch (product_id 63-67)
('Đen', '41mm', 4, 63), ('Bạc', '45mm', 3, 63),
('Đen', '40mm', 5, 64), ('Vàng', '44mm', 5, 64),
('Đen', '42mm', 3, 65), ('Xám', '46mm', 3, 65),
('Bạc', '42mm', 4, 66), ('Vàng', '46mm', 4, 66),
('Đen', '40mm', 6, 67), ('Trắng', '44mm', 5, 67),

-- Ipad (product_id 68-72)
('Xám', '128GB', 5, 68), ('Bạc', '256GB', 4, 68),
('Xanh', '64GB', 4, 69), ('Xám', '256GB', 4, 69),
('Bạc', '64GB', 7, 70), ('Đen', '128GB', 8, 70),
('Tím', '64GB', 6, 71), ('Xám', '256GB', 3, 71),
('Vàng', '128GB', 5, 72), ('Xanh', '256GB', 4, 72);

-- Watch
INSERT INTO product (name, description, price, stock_quantity, company_name, thumbnail, category_id)
VALUES
    (
        'Galaxy Watch Ultra',
        'Đồng hồ thông minh cao cấp của Samsung, hỗ trợ đo nhịp tim, GPS chính xác, màn hình AMOLED siêu sáng, pin dùng đến 3 ngày.',
        12990000,
        12,
        'Samsung',
        '/images/samsung-galaxy-watch-ultra-cam-hc-2-750x500.jpg',
        8
    );

INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Đen', '44mm', 6, 73),
                                                                          ('Bạc', '47mm', 6, 73);

-- Thêm sản phẩm Galaxy Tab S10 Series
INSERT INTO product (name, description, price, stock_quantity, company_name, thumbnail, category_id)
VALUES (
           'Galaxy Tab S10 Series',
           'Máy tính bảng cao cấp của Samsung, màn hình AMOLED 12.4", Snapdragon Gen 3, hỗ trợ bút S-Pen và DeX mode.',
           18990000,
           10,
           'Samsung',
           '/images/ipad-galaxy-s10.jpg',
           9
       );

-- Giả sử ID của sản phẩm là 74
INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Đen', '128GB', 5, 74),
                                                                          ('Bạc', '256GB', 5, 74);


INSERT INTO product (name, description, price, stock_quantity, company_name, thumbnail, category_id) VALUES
                                                                                                         ('Tai nghe Bluetooth Baseus Bowie', 'Tai nghe không dây Baseus với công nghệ chống ồn chủ động.', 690000, 20, 'Baseus', '/images/1-25.jpg', 6),
                                                                                                         ('Cáp sạc nhanh Anker Powerline III', 'Cáp sạc USB-C to Lightning bền bỉ, hỗ trợ Power Delivery.', 290000, 40, 'Anker', '/images/vn-11134207-7ra0g-makswrkjdgwnb4.jfif', 6),
                                                                                                         ('Chuột Logitech MX Master 3S', 'Chuột không dây cao cấp, cảm biến chính xác và siêu mượt.', 1890000, 15, 'Logitech', '/images/ea75234d0e26410494c86375d61449c2.webp', 6);

INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Đen', 'Standard', 10, 75), ('Trắng', 'Standard', 10, 75),
                                                                          ('Đen', '1m', 20, 76), ('Xám', '2m', 20, 76),
                                                                          ('Xám', 'Standard', 8, 77), ('Đen', 'Standard', 7, 77);

INSERT INTO product (name, description, price, stock_quantity, company_name, thumbnail, category_id) VALUES
                                                                                                         ('Bàn gaming E-DRA EGT1660', 'Thiết kế công thái học, mặt bàn carbon chống trượt.', 3290000, 10, 'E-DRA', '/images/410_z.jpg', 7),
                                                                                                         ('Bàn gaming Razer Tarok', 'Khung thép chắc chắn, phù hợp cả game lẫn làm việc.', 5190000, 7, 'Razer', '/images/Bàn gaming Fufutech X-Razer.jpg', 7),
                                                                                                         ('Bàn chơi game Cooler Master GD160', 'Mặt bàn rộng 160cm, hệ thống quản lý dây gọn gàng.', 5990000, 5, 'Cooler Master', '/images/gd160-600x600.jpg', 7);

INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Đen', '140cm', 5, 78), ('Đen đỏ', '160cm', 5, 78),
                                                                          ('Đen', '120cm', 3, 79), ('Xanh', '140cm', 4, 79),
                                                                          ('Xám', '160cm', 3, 80), ('Đen', '160cm', 2, 80);


INSERT INTO product (name, description, price, stock_quantity, company_name, thumbnail, category_id) VALUES
                                                                                                         ('Apple Watch SE 2', 'Thiết kế nhẹ, đầy đủ tính năng theo dõi sức khỏe.', 6590000, 12, 'Apple', '/images/apple-watch-se-2023-gps-sport-band-starlight.jpg', 8),
                                                                                                         ('Garmin Forerunner 265', 'Đồng hồ GPS cao cấp cho dân thể thao chuyên nghiệp.', 9990000, 8, 'Garmin', '/images/thong-minh-garmin-forerunner-265-aqua.webp', 8),
                                                                                                         ('Xiaomi Watch S1 Active', 'Thiết kế trẻ trung, pin 12 ngày, hỗ trợ 117 chế độ luyện tập.', 3490000, 20, 'Xiaomi', '/images/dong_ho_thong_minh_xiaomi_watch.jpg', 8);

INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Đen', '44mm', 6, 81), ('Trắng', '40mm', 6, 81),
                                                                          ('Xanh navy', '42mm', 4, 82), ('Đen', '46mm', 4, 82),
                                                                          ('Trắng', '44mm', 10, 83), ('Xanh', '46mm', 10, 83);


INSERT INTO product (name, description, price, stock_quantity, company_name, thumbnail, category_id) VALUES
                                                                                                         ('iPad Pro M4 11 inch Wi-Fi', 'Màn hình Liquid Retina, chip M4 mạnh mẽ, hỗ trợ Apple Pencil Pro.', 23990000, 10, 'Apple', '/images/0025624_ipad-pro-m4-11-inch-wi-fi.jpeg', 9),
                                                                                                         ('iPad Air 2024 M2', 'Mỏng nhẹ, hiệu năng vượt trội, học tập và sáng tạo cực mượt.', 18990000, 12, 'Apple', '/images/13 - ipad air 00001 2.jpg', 9),
                                                                                                         ('Galaxy Tab S9 FE+', 'Thiết kế kim loại, chống nước IP68, màn 12.4", hỗ trợ S-Pen.', 12990000, 15, 'Samsung', '/images/tab_s9_fe__green_1_2.webp', 9);

INSERT INTO product_variant (color, size, stock_quantity, product_id) VALUES
                                                                          ('Xám', '128GB', 5, 84), ('Bạc', '256GB', 5, 84),
                                                                          ('Xanh', '128GB', 6, 85), ('Tím', '256GB', 6, 85),
                                                                          ('Đen', '128GB', 7, 86), ('Xanh lá', '256GB', 8, 86);








