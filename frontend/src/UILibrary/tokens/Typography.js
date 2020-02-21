import React from 'react';

import Font from './Font';
import Token from './Token';


const Typography = () => (
    <Token
        id="typography"
        title="Typography"
        description=""
    >
        <p>
            We adopt <a href="https://github.com/edx/edx-bootstrap" target="_blank" rel="noopener noreferrer">
                edX&apos;s typography system
            </a>
            .
        </p>
        <p>
            <a href="https://material.io/design/typography/language-support.html#language-categories-reference" target="_blank" rel="noopener noreferrer">
                About languages, fonts, glyph sets
            </a>
            .
        </p>
        <p>
            This Design System is built to support the widest character glyph set possible. To do
            so, we keep things simple and utilise system fonts on the web, and Noto on apps.
            Performance being the main factor in this decision.
        </p>

        <h3>Our web font stack</h3>

        <blockquote>
            font-family: -apple-system, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, Helvetica,
            &quot;Liberation Sans&quot;, &quot;Noto Sans&quot;, sans-serif;
        </blockquote>

        <h4>A word on minority scripts on the web</h4>

        <p>
          We plan to dynamically serve custom fonts for writing scripts that are, these
          days, no longer common. Take <a href="https://en.wikipedia.org/wiki/Egyptian_hieroglyphs" target="_blank" rel="noopener noreferrer">
                Egyptian hieroglyphs
            </a> for example. If you view <a href="https://en.wikipedia.org/wiki/Egyptian_Hieroglyphs_(Unicode_block)" target="_blank"  rel="noopener noreferrer">
                a page that has Egyptian hieroglyphs embedded
            </a>,
          you&apos;ll see that these characters aren&apos;t shown on your computer. Unless
          you already have such a font installed, of course. But, by default most people
          don&apos;t. We plan to use <a href="https://www.google.com/get/noto/" target="_blank" rel="noopener noreferrer">Noto</a> for such use cases.
        </p>

        <h3>Our app font</h3>

        <blockquote><a href="https://www.google.com/get/noto/" target="_blank" rel="noopener noreferrer">Noto Sans Display</a></blockquote>

        <p>
          This app—which will support any number of scripts across mobile native
          and XR—will be bundled with all 11MB of Noto Sans Display. This covers a wide set
          of languages, but not all. The full Noto glyphset is a whopping 1GB+ download.
          For any remaining minority scripts we can conditionally load specific Noto font
          sets on the fly.
        </p>
        <br />
        <Font name="Heading 1" elem="h1" />
        <Font name="Heading 2" elem="h2" />
        <Font name="Heading 3" elem="h3" />
        <Font name="Heading 4" elem="h4" />
        <Font name="Heading 5" elem="h5" />
        <Font name="Heading 6" elem="h6" />
        <Font name="Label" elem="label" />
        <Font name="Link" elem="a" />
        <Font name="Caption" elem="button" />
        <Font name="Paragraph" elem="p" />
        <Font name="Blockquote" elem="blockquote" />
        <Font name="Cite" elem="cite" />
        <Font name="Code" elem="code" />
    </Token>
);

export default Typography;
