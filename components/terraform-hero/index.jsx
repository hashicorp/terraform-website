import Hero from '@hashicorp/react-hero'
import s from './style.module.css'

/**
 * A simple Facade around our react-hero to make the interface a little more straightforward
 * for the end-user updating this on our Homepage, while also allowing us to shim in some
 * additional styles and encapsulate that logic.
 *
 * Modified from HomepageHero component on the Boundary website:
 * https://github.com/hashicorp/boundary/tree/main/website/components/homepage-hero
 */
export default function TerraformHero({
  title,
  description,
  links,
  uiVideo,
  cliVideo,
  alert,
}) {
  return (
    <div className={s.terraformHero}>
      <Hero
        className="g-hero"
        data={{
          alert: alert ? { ...alert, tagColor: 'terraform-purple' } : null,
          title: title,
          description: description,
          buttons: links,
          product: 'terraform',
          backgroundTheme: 'light',
          centered: false,
          videos: [
            ...(uiVideo
              ? [
                  {
                    name: uiVideo.name ?? 'UI',
                    playbackRate: uiVideo.playbackRate,
                    src: [
                      {
                        srcType: uiVideo.srcType,
                        url: uiVideo.url,
                      },
                    ],
                  },
                ]
              : []),
            ...(cliVideo
              ? [
                  {
                    name: uiVideo.name ?? 'CLI',
                    playbackRate: cliVideo.playbackRate,
                    src: [
                      {
                        srcType: cliVideo.srcType,
                        url: cliVideo.url,
                      },
                    ],
                  },
                ]
              : []),
          ],
        }}
      />
    </div>
  )
}
