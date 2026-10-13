SELECT
	NULL AS 'id',
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
LEFT OUTER JOIN civicrm_phone ON
	civicrm_contact.id = civicrm_phone.contact_id
LEFT OUTER JOIN civicrm_email ON
	civicrm_contact.id = civicrm_email.contact_id
LEFT OUTER JOIN civicrm_address ON
	civicrm_contact.id = civicrm_address.contact_id
LEFT OUTER JOIN civicrm_country ON
	civicrm_country.id = civicrm_address.country_id
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