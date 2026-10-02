select
	*
from
	noasreach_entity_contents nec;  

select
	*
from
	noasreach_entity_contents nec
left join civicrm_contact cc on
	cc.id = nec.entity_id
	and nec.entity_type = 'Contact'
left join civicrm_membership cm on
	cm.id = nec.entity_id
	and nec.entity_type = 'Membership'
left join civicrm_contribution cc2 on
	cc2.id = nec.entity_id
	and nec.entity_type = 'Contribution'
where
	content like '%smith%'
	and display_name like "%barry%";

