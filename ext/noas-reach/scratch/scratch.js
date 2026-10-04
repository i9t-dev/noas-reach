const request = {
    entity: "Content",
    action: "get",
    options: {
        join: [
            ["Contact AS contact",
                "LEFT",
                ["entity_type", "=", "'Contact'"],
                ["entity_id", "=", "contact.id"],
            ],
            ["Membership AS membership",
                "LEFT",
                ["entity_type", "=", "'Membership'"],
                ["entity_id", "=", "membership.id"],
            ],
            ["Contribution AS contribution",
                "LEFT",
                ["entity_type", "=", "'Contribution'"],
                ["entity_id", "=", "contribution.id"],
            ],
        ],
        select: ["contact.display_name", "join_date", "start_date", "end_date"],
        limit: 25,
    },
}

const officialReq = {
    entity: 'Membership',
    action: 'get',
    options: {
        join: [
            ["Contact AS contact",
                "LEFT",
                ["contact_id", "=", "contact.id"],
                ["contact.source", "=", "\"Payment\""]
            ],
            ["MembershipType AS membership_type",
                "LEFT",
                ["membership_type_id", "=", "membership_type.id"]
            ],
        ],
        limit: 25
    },
}

CRM.api4('Membership', 'get', {
    join: [["Contact AS contact", "LEFT", ["contact_id", "=", "contact.id"], ["contact.source", "=", "\"Payment\""]], ["MembershipType AS membership_type", "LEFT", ["membership_type_id", "=", "membership_type.id"]]],
    limit: 25
}).then((memberships) => {
}, (failure) => {
});

CRM.api4(request.entity, request.action, request.options)
    .then(
        (memberships) => {
            console.log(memberships)
        },
        (failure) => {
            console.log(failure)
        }
    )
