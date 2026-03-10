import React from 'react';
import { useApp } from '../../context/AppContext';

const HallTable = ({ hallId }) => {
  const { students, exams } = useApp();
  const hallExams = exams.filter((e) => e.hallId === hallId);

  return (
    <div className="table-card">
      <h2>Hall Seating</h2>
      <table>
        <thead>
          <tr><th>Seat</th><th>Student</th><th>Exam</th><th>Date</th></tr>
        </thead>
        <tbody>
          {hallExams.map((exam, i) =>
            exam.students?.map((sid, j) => {
              const student = students.find((s) => s._id === sid);
              return (
                <tr key={`${i}-${j}`}>
                  <td>{j + 1}</td>
                  <td>{student?.name || '—'}</td>
                  <td>{exam.subject}</td>
                  <td>{exam.date}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HallTable;