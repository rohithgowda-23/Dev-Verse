export default function QuestionBriefing({ question, slotNumber, isSolved }) {
  const { title, briefing } = question;

  return (
    <section
      className="glass-card"
      aria-label={`Question ${slotNumber} Briefing`}
      style={{
        width: '100%',
        padding: '20px 24px',
        marginBottom: '20px',
        borderColor: 'rgba(255, 255, 255, 0.22)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px',
        }}
      >
        <span className="badge badge-cyan">QUESTION 0{slotNumber} // BRIEFING</span>
        {isSolved && <span className="badge badge-green">COMPLETED</span>}
      </div>

      <h2 className="font-display" style={{ margin: '0 0 12px', fontSize: '1.32rem', color: '#ffffff' }}>
        {title}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1rem', color: '#d4d4d4', lineHeight: 1.6 }}>
        <div>
          <strong style={{ color: '#ffffff' }}>Mission: </strong>
          {briefing.missionDescription}
        </div>
        <div>
          <strong style={{ color: '#ffffff' }}>Objective: </strong>
          {briefing.objective}
        </div>
        <div>
          <strong style={{ color: '#ffffff' }}>What to do: </strong>
          {briefing.whatToDo}
        </div>
        <div>
          <strong style={{ color: '#ffffff' }}>How to interact: </strong>
          {briefing.howToInteract}
        </div>
        <div>
          <strong style={{ color: '#ffffff' }}>Completion: </strong>
          {briefing.completionCondition}
        </div>
      </div>
    </section>
  );
}
