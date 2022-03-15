// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

/**
 * Directive to observe mutations on some attributes and propagate them inside.
 * Current supported attributes: ion-button.aria-label
 *
 * This is necessary in order to update some attributes that are not reactive, for example aria-label.
 *
 * @see https://github.com/ionic-team/ionic-framework/issues/21534
 */
@Directive({
    selector: 'ion-button',
})
export class CoreUpdateNonReactiveAttributesDirective implements OnInit, OnDestroy {

    protected element: HTMLIonButtonElement;
    protected mutationObserver: MutationObserver;

    constructor(element: ElementRef<HTMLIonButtonElement>) {
        this.element = element.nativeElement;
        this.mutationObserver = new MutationObserver(() => {
            const ariaLabel = this.element.getAttribute('aria-label');
            if (!ariaLabel) {
                // Aria label unset by ionButton component (when first created).
                return;
            }

            // Propagate label to button.
            const button = this.element.shadowRoot?.querySelector('button');
            button?.setAttribute('aria-label', ariaLabel);
        });
    }

    /**
     * @inheritdoc
     */
    async ngOnInit(): Promise<void> {
        await this.element.componentOnReady();

        if (!this.element.getAttribute('aria-label')) {
            return;
        }

        this.mutationObserver.observe(this.element, { attributes: true, attributeFilter: ['aria-label'] });
    }

    /**
     * @inheritdoc
     */
    ngOnDestroy(): void {
        this.mutationObserver.disconnect();
    }

}
