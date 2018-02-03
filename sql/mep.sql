DROP TABLE mep;
CREATE TABLE IF NOT EXISTS mep
(
    id int unsigned NOT NULL AUTO_INCREMENT,
    filename varchar(100) NOT NULL,
    username varchar(40) NOT NULL,
    size bigint NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
