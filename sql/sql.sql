SET sql_mode = '';
use php;
CREATE TABLE users
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    email    varchar(255),
    password longtext,
    role     int
);

create table trademarks
(
    id       int AUTO_INCREMENT PRIMARY KEY,
    name     varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ,
    icon_url varchar(255),
    created_at          timestamp,
    updated_at          timestamp,
    deleted_at          timestamp
);

create table discounts
(
    id    bigint(20) unsigned AUTO_INCREMENT PRIMARY KEY,
    type  varchar(10),
    value int,
    created_at          timestamp,
    updated_at          timestamp,
    deleted_at          timestamp
);

# Danh mục sản phẩm: vd iphone 13, xiaomi note 7
create table product_category
(
    id           bigint(20) unsigned AUTO_INCREMENT PRIMARY KEY,
    name         varchar(255),
    image_url    varchar(255),
    trademark_id int,
    created_at          timestamp,
    updated_at          timestamp,
    deleted_at          timestamp
);

# sản phẩm thep từng danh mục: vd iphone 13 bản 64GB, xiaomi note 7 bản 128GB mới 99%,...
create table products
(
    id                  bigint(20) unsigned AUTO_INCREMENT PRIMARY KEY,
    product_category_id bigint(20) unsigned,
    name                varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ,
    description         longtext  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ,
    first_image         varchar(255),
    second_image        varchar(255),
    third_image         varchar(255),
    type                varchar(20),
    memory              int default null,
    detail              longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ,
    price               bigint,
    discount_id         bigint(20) unsigned,
    created_at          timestamp,
    updated_at          timestamp,
    deleted_at          timestamp,
    FOREIGN KEY (discount_id) REFERENCES discounts (id),
	FOREIGN KEY (product_category_id) REFERENCES product_category (id)
);

# Thông số sản phẩm thep type: vd màu sắc, màn hinh, RAM. price_value_fixed là giá sản phẩm tăng hoặc giảm bao nhiêu so với type này
# inventory sản phẩm theo màu sắc...(theo type) có trong kho
create table product_item
(
    id                bigint(20) unsigned AUTO_INCREMENT PRIMARY KEY,
    product_id        bigint(20) unsigned,
    type              varchar(255),
    value             varchar(255),
    image             varchar(255),
    price_type_fixed  varchar(255) not null default 'plush',
    price_value_fixed bigint(20)           default 0,
    inventory         bigint,
    FOREIGN KEY (product_id) REFERENCES products (id)
);



# Chăm sóc khách hàng. status = 0 là đang chờ được tư vấn, là 1 nếu đã được gọi điện tư vấn chăm sóc
create table advise
(
    id         bigint(20) unsigned AUTO_INCREMENT PRIMARY KEY,
    phone      varchar(20),
    product_id bigint(20) unsigned,
    status     int default 0,
    created_at timestamp,
    updated_by int,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (updated_by) REFERENCES users (id)
   
);

# hóa đơn
create table orders
(
    id         bigint(20) unsigned AUTO_INCREMENT PRIMARY KEY,
    phone      varchar(20),
    name       varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ,
    address    longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ,
    status     varchar(10),
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
);

# Các sản phẩm hoặc combo trong hóa đơn đó
create table order_item
(
    id         bigint(20) unsigned AUTO_INCREMENT PRIMARY KEY,
    order_id   bigint(20) unsigned,
    product_id bigint(20) unsigned,
    numb       bigint,
    price      bigint,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);
