SELECT
    civicrm_contact.id AS 'entity_id',
    'Contact' AS 'entity_type',
    CONCAT_WS (
        '\n',
        contact_type,
        display_name,
        IF (
            civicrm_phone.id IS NULL,
            "Unknown phone",
            civicrm_phone.phone
        ),
        IF (
            civicrm_email.id IS NULL,
            "Unknown email",
            civicrm_email.email
        ),
        IF (
            civicrm_address.id IS NULL,
            "Unknown address",
            CONCAT_WS (
                '\n',
                civicrm_address.street_address,
                civicrm_address.city,
                civicrm_address.country_id
            )
        )
    ) AS content
FROM
    civicrm_contact
    LEFT OUTER JOIN civicrm_phone ON civicrm_contact.id = civicrm_phone.contact_id
    LEFT OUTER JOIN civicrm_email ON civicrm_contact.id = civicrm_email.contact_id
    LEFT OUTER JOIN civicrm_address ON civicrm_contact.id = civicrm_address.contact_id
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
    `entity_id` ASC;

-- To do: other entities