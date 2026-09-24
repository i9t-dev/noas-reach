DROP TABLE IF EXISTS noasreach_entity_contents;

CREATE TABLE noasreach_entity_contents (
    entity_type VARCHAR(32) NOT NULL,
    entity_id INT NOT NULL,
    content TEXT,
    PRIMARY KEY (entity_id, entity_type),
    FULLTEXT (content)
);

INSERT INTO
    noasreach_entity_contents (
        (
            SELECT
                'Contact' AS 'entity_type',
                civicrm_contact.id AS 'entity_id',
                CONCAT_WS (
                    '\n',
                    contact_type,
                    display_name,
                    civicrm_phone.phone,
                    civicrm_email.email,
                    NULLIF(
                        CONCAT_WS (
                            '\n',
                            civicrm_address.street_address,
                            civicrm_address.city,
                            civicrm_country.name
                        ),
                        ''
                    )
                ) AS content
            FROM
                civicrm_contact
                LEFT OUTER JOIN civicrm_phone ON civicrm_contact.id = civicrm_phone.contact_id
                LEFT OUTER JOIN civicrm_email ON civicrm_contact.id = civicrm_email.contact_id
                LEFT OUTER JOIN civicrm_address ON civicrm_contact.id = civicrm_address.contact_id
                LEFT OUTER JOIN civicrm_country ON civicrm_country.id = civicrm_address.country_id
            WHERE
                (
                    civicrm_phone.is_primary = 1
                    OR civicrm_phone.id IS NULL
                )
                AND (
                    civicrm_email.is_primary = 1
                    OR civicrm_email.id IS NULL
                )
                AND (
                    civicrm_address.is_primary = 1
                    OR civicrm_address.id IS NULL
                )
            ORDER BY
                `entity_id` ASC
        )
        UNION
        (
            SELECT
                'Membership' AS 'entity_type',
                civicrm_membership.id AS 'entity_id',
                CONCAT_WS (
                    '\n',
                    civicrm_membership_type.name,
                    `start_date`,
                    end_date,
                    source,
                    civicrm_membership_status.label
                ) AS content
            FROM
                civicrm_membership
                JOIN civicrm_membership_type ON civicrm_membership.membership_type_id = civicrm_membership_type.id
                JOIN civicrm_membership_status ON civicrm_membership.status_id = civicrm_membership_status.id
            ORDER BY
                `entity_id` ASC
        )
        UNION
        (
            SELECT
                'Contribution' as 'entity_type',
                civicrm_contribution.id as 'entity_id',
                CONCAT_WS (
                    '\n',
                    civicrm_contribution.total_amount,
                    civicrm_contribution.trxn_id,
                    DATE(civicrm_contribution.receive_date),
                    civicrm_option_value.name
                )
            FROM
                civicrm_contribution
                JOIN civicrm_option_value ON civicrm_contribution.payment_instrument_id = civicrm_option_value.value
                JOIN civicrm_option_group ON civicrm_option_value.option_group_id = civicrm_option_group.id
                AND civicrm_option_group.name = 'payment_instrument'
        )
    );
