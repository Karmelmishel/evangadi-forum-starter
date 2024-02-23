const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// post answer
const giveAnswer = async (req, res) => {
  const { answer } = req.body;
  console.log("ansewers", answer);
  console.log("Answer length:", answer.length);

  const question_id = req.params.questionid;
  const user_id = req.user.userid;
  console.log("questionid", question_id);
  console.log("userid", user_id);

  if (!answer) {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ msg: "provide answer field" });
  }
  try {
    await dbConnection.query(
      "INSERT INTO answers (questionid, userid, answer) VALUES (?, ?, ?)",
      [question_id, user_id, answer]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "something went to wrong try again later" });
  }
};
// red all answer
async function readAllAnswer(req, res) {
  const questionid = req.params.questionid;
  const allAnswer = `SELECT * FROM answers WHERE questionid='${questionid}'`;

  try {
    const connection = await dbConnection.getConnection();
    const [result] = await connection.query(allAnswer);
    connection.release();

    if (result.length === 0) {
      res.send("No answers provided");
    } else {
      res.json({ answers: result });
    }
  } catch (err) {
    res.send(err.message);
  }
}

module.exports = { giveAnswer, readAllAnswer };
