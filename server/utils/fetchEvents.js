const { default: axios } = require("axios");
const client = require("../db/connect");

const fetchEvents = async (ems_token, userId) => {
    const options = {
        method: "GET",
        url: `${process.env.EMS_API}/user_events`,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ems_token}`,
        },
    };
    try {
        const response = await axios(options);
        const result = await client.query(`select * from user_events where fk_user = $1`, [userId]);
        let ems_events = await response.data.events
        var events_to_insert = [];
        if(result.rowCount > 0) {
            const submission_events = result.rows;
            ems_events.forEach(ems => {
                if(!submission_events.find(sub=>sub.ems_id === ems.id)) {

                }
            });
        } else {
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports = fetchEvents;