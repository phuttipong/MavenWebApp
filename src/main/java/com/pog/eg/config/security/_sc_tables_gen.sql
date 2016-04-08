# noinspection SqlNoDataSourceInspectionForFile

CREATE TABLE `sc_users` (
  `id`                      BINARY(16)              NOT NULL,
  `username`                VARCHAR(50)
                            COLLATE utf8_unicode_ci NOT NULL,
  `password`                VARCHAR(60)
                            COLLATE utf8_unicode_ci NOT NULL,
  `enabled`                 BIT(1)                  NOT NULL DEFAULT b'1',
  `first_name`              VARCHAR(45)
                            COLLATE utf8_unicode_ci NOT NULL,
  `family_name`             VARCHAR(45)
                            COLLATE utf8_unicode_ci          DEFAULT NULL,
  `language`                VARCHAR(5)
                            COLLATE utf8_unicode_ci NOT NULL,
  `create_time`             TIMESTAMP               NULL     DEFAULT NULL,
  `password_update_date`    DATE                             DEFAULT NULL,
  `notification_read_time`  TIMESTAMP               NULL     DEFAULT NULL,
  `account_non_expired`     BIT(1)                           DEFAULT b'1'
  COMMENT '<code>true</code> if the account has not expired',
  `credentials_non_expired` BIT(1)                           DEFAULT b'1'
  COMMENT '<code>true</code> if the credentials have not expired',
  `account_non_locked`      BIT(1)                           DEFAULT b'1'
  COMMENT '<code>true</code> if the account is not locked',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

CREATE TABLE `sc_roles` (
  `id`   BINARY(16)              NOT NULL,
  `name` VARCHAR(50)
         COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

CREATE TABLE `sc_authorities` (
  `user_id`          BINARY(16) NOT NULL,
  `security_role_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`user_id`, `security_role_id`),
  KEY `role_idx` (`security_role_id`),
  CONSTRAINT `security_role_id` FOREIGN KEY (`security_role_id`) REFERENCES `sc_roles` (`id`)
    ON UPDATE CASCADE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `sc_users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

# Have to prefix role name with ROLE_
# http://stackoverflow.com/questions/11539162/why-does-spring-securitys-rolevoter-need-a-prefix
INSERT INTO sc_roles VALUES (UNHEX('081ef22a3c194efbbb8c9743bf141c6c'), 'ROLE_ADMIN');
INSERT INTO sc_users (id, username, password, first_name, family_name, language)
VALUES
  (UNHEX('164175f99464458b85860b86d37b13c4'), 'admin', '$2a$11$c32i8AMxu/2bYFf0AfboNO6at5ehnHazFR5k01RSFFThVP.5KACNu',
   'admin', '', 'en');
INSERT INTO sc_authorities
VALUES (UNHEX('164175f99464458b85860b86d37b13c4'), UNHEX('081ef22a3c194efbbb8c9743bf141c6c'));

