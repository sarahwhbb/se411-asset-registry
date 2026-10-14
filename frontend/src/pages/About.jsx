const team = [
  { name: 'Sarah Alwehaibi', studentId: '222411043' },
  { name: 'Aljoharah Bin Nouh', studentId: '222511268' },
  { name: 'Hatoon Alsolaim', studentId: '222511254' },
]

export default function About() {
  return (
    <section>
      <h1>About</h1>
      <p>SE411 (Fall 2026-27) project: a computer asset registry built with React.</p>
      <h2>Team members</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Student ID</th>
          </tr>
        </thead>
        <tbody>
          {team.map((m) => (
            <tr key={m.studentId}>
              <td>{m.name}</td>
              <td>{m.studentId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
