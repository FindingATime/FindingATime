import { useState } from 'react'

export default function FAQ() {
  const faqs = [
    {
      question: 'How do I create a new event?',
      answer:
        "To create a new event, go to the 'Create Event' page and fill in the event details, or press 'New Event' from the dashboard.",
    },
    {
      question: 'How do I invite participants?',
      answer:
        'To invite participants, share the event link with them after creating a new event.',
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div id="FAQ" className="mx-auto mt-5 max-w-2xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Frequently Asked Questions
      </h1>
      {faqs.map((faq, index) => (
        <div key={index} className="mb-4">
          <button
            onClick={() => toggleFAQ(index)}
            className="btn btn-secondary w-full rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="text-lg font-medium">{faq.question}</span>
          </button>
          {openIndex === index && (
            <div className="mt-2 rounded-lg p-4">
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
