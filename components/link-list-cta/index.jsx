import s from './style.module.css'
import InlineSvg from '@hashicorp/react-inline-svg'
import RightArrow from 'public/img/icons/arrow-right.svg?include'
import Link from 'next/link'
import LinkWrap from '@hashicorp/react-link-wrap'

export default function LinkListCTA({ heading, background, links }) {
  return (
    <div className={s.linkListCta + (background ? ' ' + s[background] : '')}>
      <h2 className="g-type-display-2">{heading}</h2>
      <div className={s.links}>
        {links.map((link) => (
          <LinkWrap
            key={link.text}
            href={link.url}
            link={Link}
            className={s.link}
          >
            <div className={s.text}>
              <p className="g-type-buttons-and-standalone-links">{link.text}</p>
            </div>
            <InlineSvg className={s.arrow} src={RightArrow} />
          </LinkWrap>
        ))}
      </div>
    </div>
  )
}
