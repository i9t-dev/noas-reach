(
    SELECT
        'Contact' AS 'entity_type',
        civicrm_contact.id AS 'entity_id',
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
        `entity_id` ASC
)
UNION
(
    SELECT
        'Membership' AS 'entity_type',
        civicrm_membership.id AS 'entity_id',
        CONCAT_WS (
            '\n',
            CONCAT_WS (' ', '[Status]', civicrm_membership_status.label),
            CONCAT_WS (' ', '[Payment]', source),
            CONCAT_WS (' ', '[Type]', civicrm_membership_type.name),
            CONCAT_WS (' ', '[Joined]', join_date),
            CONCAT_WS (' ', "[Start]", start_date),
            CONCAT_WS (' ', "[End]", end_date)
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
            CONCAT_WS (
                ' ',
                '[Amount]',
                civicrm_contribution.total_amount
            ),
            CONCAT_WS (
                ' ',
                '[Transaction]',
                civicrm_contribution.trxn_id
            ),
            CONCAT_WS (
                ' ',
                '[Received]',
                civicrm_contribution.receive_date
            ) -- ,
            -- DB stores the payment method options in civicrm_options
            -- CONCAT_WS (' ', '[Payment]', civicrm_TBD.label),
            -- CONCAT_WS (' ', '[Type]', civicrm_TBD.label),
        )
    FROM
        civicrm_contribution
);