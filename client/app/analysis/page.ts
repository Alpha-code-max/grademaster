import React from 'react';

const AnalysisPage = () => {
    const courses = [
        { id: 1, name: 'Mathematics', students: 30, averageGrade: 85 },
        { id: 2, name: 'Physics', students: 25, averageGrade: 78 },
        { id: 3, name: 'Chemistry', students: 20, averageGrade: 82 },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Course Analysis</h1>
            <table border="1" style={{ width: '100%', textAlign: 'left', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Number of Students</th>
                        <th>Average Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.name}</td>
                            <td>{course.students}</td>
                            <td>{course.averageGrade}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AnalysisPage;