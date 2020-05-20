import React from 'react'
import styled from 'styled-components'
import { HiddenLink } from '../shared/Layouts'

const FooterContainer = styled.div`
    padding: 0% 6%;
    display: flex;
    height: 140px;
    background: #434653 0% 0% no-repeat padding-box;
    align-items: center;
    justify-content: space-between;
`

const FooterLinkText = styled.div`
    color: white;
    font-size: 16px;
    font-weight: 500;
`

const CopyrightText = styled.div`
    color: white;
    font-size: 16px;
    font-weight: 300;
    text-align: right;
`

const FooterText = styled.div`
    font-size: 39px;
    color: white;
`

function Footer() {
    return (
        <FooterContainer>
            <FooterLinkText>
                <HiddenLink to="/about">
                    <p>About</p>
                </HiddenLink>
                <HiddenLink to="/terms">
                    <p>Terms & Privacy</p>
                </HiddenLink>
                <HiddenLink to="/commandments">
                    <p>Stoke List Commandments</p>
                </HiddenLink>
            </FooterLinkText>
            {/*eslint-disable-next-line*/}
            <FooterText>
                //the <b>stoke list.</b>
            </FooterText>
            <CopyrightText>
                <div>Copyright 2009-2020</div>
                <div>All Rights Reserved</div>
            </CopyrightText>
        </FooterContainer>
    )
}

export default Footer
