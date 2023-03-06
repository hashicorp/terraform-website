import * as React from 'react'
import classNames from 'classnames'
import { useFlagBag } from 'flags/client'
import Image from 'next/image'
import type { Products } from '@hashicorp/platform-product-meta'
import type { IntroProps } from '@hashicorp/react-intro/types'
import Intro from '@hashicorp/react-intro'
import Button from '@hashicorp/react-button'
import StandaloneLink from '@hashicorp/react-standalone-link'
import s from './style.module.css'

interface IoHomeHeroAltProps {
  brand: Products
  heading: IntroProps['heading']
  description: IntroProps['description']
  ctas: IntroProps['actions']['ctas']
}

export default function IoHomeHeroAlt({
  brand,
  heading,
  description,
  ctas,
}: IoHomeHeroAltProps) {
  const flagBag = useFlagBag()
  const hiddenProps = {
    'aria-hidden': true,
    tabindex: '-1',
  }
  return (
    <header className={s.hero}>
      <div className={s.patterns}>
        <div className={s.patternsStart}>
          <Image
            src={require('./pattern-start.svg')}
            width={418}
            height={543}
            layout="fill"
            objectFit="cover"
            alt=""
            priority
          />
        </div>
        <div className={s.patternsEnd}>
          <Image
            src={require('./pattern-end.svg')}
            width={418}
            height={543}
            layout="fill"
            objectFit="cover"
            alt=""
            priority
          />
        </div>
      </div>
      <div className={s.container}>
        <div className={s.inner}>
          <Intro
            textAlignment="center"
            heading={heading}
            headingSize={1}
            description={description}
            // Temporary use custom actions implementation for experiement.
            //
            // actions={{
            //   layout: 'stacked',
            //   theme: brand,
            //   ctas: ctas.map(
            //     (cta: { title: string; href: string }, index: number) => {
            //       return {
            //         ...cta,
            //         type: index === 0 ? 'button' : 'standalone-link',
            //       }
            //     }
            //   ) as IntroProps['actions']['ctas'],
            // }}
          />
          <div className={s.actions}>
            {ctas.map((cta, index) => {
              if (index === 0) {
                return (
                  <div
                    className={classNames(
                      s.actionsPrimary,
                      flagBag.settled && s.settled,
                      flagBag.flags?.tryForFree ? s.control : s.variant
                    )}
                  >
                    <Button
                      title="Try Terraform Cloud"
                      url={cta.href}
                      theme={{ brand }}
                      {...(flagBag.settled &&
                        flagBag.flags?.tryForFree === true && {
                          ...hiddenProps,
                        })}
                    />

                    <Button
                      title="Try for free"
                      url={cta.href}
                      theme={{ brand }}
                      {...(flagBag.settled &&
                        flagBag.flags?.tryForFree === false && {
                          ...hiddenProps,
                        })}
                    />
                  </div>
                )
              }

              return (
                <StandaloneLink href={cta.href} theme="secondary">
                  {cta.title}
                </StandaloneLink>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
