const mysql = require('mysql');

const bodyParts = ["back", "cardio", "chest", "lower arms", "lower legs", "neck", "shoulders", "upper arms", "upper legs", "waist"];

function connectToDatabase() {
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shiv@7353',
    database: 'fitness_db',
  });

  db.connect((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log('Connected to database successfully!');
  });

  return db;
}

function getRandomExerciseIdForBodyPart(db, bodyPart) {
  return new Promise((resolve, reject) => {
    db.query('SELECT exercise_id FROM exercise_list WHERE bodypart = ?', [bodyPart], (err, results) => {
      if (err) {
        reject(err);
      } else {
        const exerciseIds = results.map((row) => row.exercise_id);
        resolve(exerciseIds[Math.floor(Math.random() * exerciseIds.length)]);
      }
    });
  });
}

function generateExercisePlanDetails(db, planId) {
  return new Promise((resolve, reject) => {
    const exercisePlanDetails = [];
    for (let day = 1; day <= 30; day++) {
      for (const bodyPart of bodyParts) {
        getRandomExerciseIdForBodyPart(db, bodyPart).then((exerciseId) => {
          exercisePlanDetails.push({
            planId,
            day,
            exerciseId,
          });
        }).catch(reject);
      }
    }

    resolve(exercisePlanDetails);
  });
}

function insertExercisePlanDetailsIntoDatabase(db, exercisePlanDetails) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO exercise_plan_details (plan_id, day, exercise_id) VALUES ?';
    db.query(sql, [exercisePlanDetails], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function main() {
  const db = connectToDatabase();

  const exercisePlans = await new Promise((resolve, reject) => {
    db.query('SELECT plan_id FROM exerciseplans', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.map((row) => row.plan_id));
      }
    });
  });

  for (const planId of exercisePlans) {
    const exercisePlanDetails = await generateExercisePlanDetails(db, planId);
    await insertExercisePlanDetailsIntoDatabase(db, exercisePlanDetails);
  }

  db.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
