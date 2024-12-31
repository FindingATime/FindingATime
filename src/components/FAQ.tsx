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
    {
      question:
        'How do I find my created events or events I added my availability to?',
      answer:
        'Click on the "Dashboard" button in the top right corner of the screen to see a list of your created events.',
    },
    {
      question: 'My availability has changed. How do I update it?',
      answer:
        'Visit your Event or find and visit the link on the Dashboard.  Click the "Edit Availability" button on the bottom right part of the page and update your availability.',
    },
    {
      question: 'How do I know when the best time to meet is?',
      answer:
        'Visit your Event or find and visit the link on the Dashboard.  Look at the availability grid and see when the best time to meet is by hovering over the darkest green cells.  Hovering over a cell identifies which respondents, highlighted in green, are available in the Responders list on the right.',
    },
    {
      question: 'What is the difference between Regular and Preferred times?',
      answer:
        'Regular times are times you are available to meet, while Preferred times are times you would prefer to meet. Event attendees can see how many attendees are available based on both their regular and preferred times, and use that to determine the best time to meet.',
    },
    {
      question: 'How can I set a preferred time?',
      answer:
        'When adding your availability, use the toggle beneath the availability grid to toggle between adding times as "Regular" or "Preferred". "Regular" times are added to the grid in green, while "Preferred" times are added in blue. The grid does not distinguish between the two in view mode, but there will be a list beneath the Responders list of the number of attendees available in times that are marked as "Preferred".',
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
