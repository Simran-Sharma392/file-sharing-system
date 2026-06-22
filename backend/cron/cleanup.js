const cron=require("node-cron");
const db=require("../config/db");
cron.schedule("0 * * * *", ()=>{
    const sql=`
    UPDATE files SET status="EXPIRED" where expiry<now() and status="active"`;
    db.query(sql, (err,result)=>{
        if(err){
            console.error("Cron cleanup error: ", err);
            return;
        }
        console.log(`Cleanup complete. ${result.affectedRows} file(s) expired`);
    });
});