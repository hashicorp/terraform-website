import Link from 'next/link'
import { useErrorPageAnalytics } from '@hashicorp/platform-analytics';

export default function NotFound() {
  useErrorPageAnalytics(404);

  return (
    <div id="p-404" className="g-grid-container">
      <h1 className="g-type-display-1">Page Not Found</h1>
      <p>
        We&lsquo;re sorry but we can&lsquo;t find the page you&lsquo;re looking
        for.
      </p>
      <p>
        <Link href="/">
          Back to Home
        </Link>
      </p>
    </div>
  );
}
