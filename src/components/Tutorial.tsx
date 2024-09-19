import Link from 'next/link'

export default function Tutorial() {
  return (
    <div
      id="Tutorial"
      className="mb-5 mt-10 flex flex-col items-center justify-center"
    >
      <h1 className="mb-4 text-center text-4xl font-extrabold text-primary">
        How it works:
      </h1>
      <ol className="list-inside list-decimal text-xl">
        <li>
          Create a new Finding a Time event by clicking the
          <Link href="/create-event">
            <button className="btn btn-primary btn-sm mx-3">
              Create Event
            </button>
          </Link>
          button
        </li>
        <li>
          Fill in the event details like which specific days you want to choose
          from or which days of the week for recurring events
        </li>
        <li>Add your availability for each day</li>
        <li>
          Share the provided link with participants so they can add their
          availability
        </li>
        <li>
          View and edit your events from the
          <Link href="/home">
            <button className="btn btn-primary btn-sm mx-3">Dashboard</button>
          </Link>
        </li>
      </ol>
      <div className="mt-4">
        <Link href="/home">
          <button className="btn btn-primary">
            Get Started By Creating Your First Event
          </button>
        </Link>
      </div>
    </div>
  )
}
