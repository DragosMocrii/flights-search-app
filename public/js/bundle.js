
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = "//localhost:35729/livereload.js?snipver=1"; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (!store || typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, callback) {
        const unsub = store.subscribe(callback);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if (typeof $$scope.dirty === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function add_resize_listener(element, fn) {
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        const object = document.createElement('object');
        object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
        object.setAttribute('aria-hidden', 'true');
        object.type = 'text/html';
        object.tabIndex = -1;
        let win;
        object.onload = () => {
            win = object.contentDocument.defaultView;
            win.addEventListener('resize', fn);
        };
        if (/Trident/.test(navigator.userAgent)) {
            element.appendChild(object);
            object.data = 'about:blank';
        }
        else {
            object.data = 'about:blank';
            element.appendChild(object);
        }
        return {
            cancel: () => {
                win && win.removeEventListener && win.removeEventListener('resize', fn);
                element.removeChild(object);
            }
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                info.blocks[i] = null;
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => store.subscribe((value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.16.7 */

    const { Error: Error_1, Object: Object_1 } = globals;

    function create_fragment(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: { params: /*componentParams*/ ctx[1] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*componentParams*/ 2) switch_instance_changes.params = /*componentParams*/ ctx[1];

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(route, userData, ...conditions) {
    	if (userData && typeof userData == "function") {
    		conditions = conditions && conditions.length ? conditions : [];
    		conditions.unshift(userData);
    		userData = undefined;
    	}

    	if (!route || typeof route != "function") {
    		throw Error("Invalid parameter route");
    	}

    	if (conditions && conditions.length) {
    		for (let i = 0; i < conditions.length; i++) {
    			if (!conditions[i] || typeof conditions[i] != "function") {
    				throw Error("Invalid parameter conditions[" + i + "]");
    			}
    		}
    	}

    	const obj = { route, userData };

    	if (conditions && conditions.length) {
    		obj.conditions = conditions;
    	}

    	Object.defineProperty(obj, "_sveltesparouter", { value: true });
    	return obj;
    }

    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	const qsPosition = location.indexOf("?");
    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(getLocation(), function start(set) {
    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	setTimeout(
    		() => {
    			window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    		},
    		0
    	);
    }

    function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	setTimeout(
    		() => {
    			const dest = (location.charAt(0) == "#" ? "" : "#") + location;
    			history.replaceState(undefined, undefined, dest);
    			window.dispatchEvent(new Event("hashchange"));
    		},
    		0
    	);
    }

    function link(node) {
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	const href = node.getAttribute("href");

    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute");
    	}

    	node.setAttribute("href", "#" + href);
    }

    function instance($$self, $$props, $$invalidate) {
    	let $loc,
    		$$unsubscribe_loc = noop;

    	validate_store(loc, "loc");
    	component_subscribe($$self, loc, $$value => $$invalidate(4, $loc = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_loc());
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;

    	class RouteItem {
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.route;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    			} else {
    				this.component = component;
    				this.conditions = [];
    				this.userData = undefined;
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		match(path) {
    			if (prefix && path.startsWith(prefix)) {
    				path = path.substr(prefix.length) || "/";
    			}

    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				out[this._keys[i]] = matches[++i] || null;
    			}

    			return out;
    		}

    		checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	const routesIterable = routes instanceof Map ? routes : Object.entries(routes);
    	const routesList = [];

    	for (const [path, route] of routesIterable) {
    		routesList.push(new RouteItem(path, route));
    	}

    	let component = null;
    	let componentParams = {};
    	const dispatch = createEventDispatcher();

    	const dispatchNextTick = (name, detail) => {
    		setTimeout(
    			() => {
    				dispatch(name, detail);
    			},
    			0
    		);
    	};

    	const writable_props = ["routes", "prefix"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    	};

    	$$self.$capture_state = () => {
    		return {
    			routes,
    			prefix,
    			component,
    			componentParams,
    			$loc
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ("$loc" in $$props) loc.set($loc = $$props.$loc);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*component, $loc*/ 17) {
    			 {
    				$$invalidate(0, component = null);
    				let i = 0;

    				while (!component && i < routesList.length) {
    					const match = routesList[i].match($loc.location);

    					if (match) {
    						const detail = {
    							component: routesList[i].component,
    							name: routesList[i].component.name,
    							location: $loc.location,
    							querystring: $loc.querystring,
    							userData: routesList[i].userData
    						};

    						if (!routesList[i].checkConditions(detail)) {
    							dispatchNextTick("conditionsFailed", detail);
    							break;
    						}

    						$$invalidate(0, component = routesList[i].component);
    						$$invalidate(1, componentParams = match);
    						dispatchNextTick("routeLoaded", detail);
    					}

    					i++;
    				}
    			}
    		}
    	};

    	return [component, componentParams, routes, prefix];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { routes: 2, prefix: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const token_val = localStorage.getItem('auth_token') || null;

    const auth_token = writable(token_val);

    const app_errors = writable([]);

    async function fetchData(url = '', method = 'GET', data = {}) {
        const token_value = get_store_value(auth_token);
        // Default options are marked with *
        const opts = {
            method: method, // GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            //redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
        };

        if (method !== 'GET') {
            opts['body'] = JSON.stringify(data); // body data type must match "Content-Type" header
        }

        if (token_value) {
            opts.headers['Authorization'] = 'Bearer ' + token_value;
        }

        const response = await fetch(url, opts);

        if (response.status === 401) {
            resetAuthToken();
        }

        return await response.json(); // parses JSON response into native JavaScript objects
    }

    function postData(url, data) {
        return fetchData(url, 'POST', data)
    }

    function getData(url, data) {
        const query_string = new URLSearchParams(data).toString();
        url = query_string ? (url + '?' + query_string) : url;

        return fetchData(url, 'GET')
    }

    function deleteData(url, data) {
        return fetchData(url, 'DELETE', data)
    }

    function resetAuthToken() {
        console.log('Auth token reset.');
        localStorage.removeItem('auth_token');
        auth_token.set(null);
        replace('/login');
    }

    /* src/routes/Login.svelte generated by Svelte v3.16.7 */
    const file = "src/routes/Login.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let button;
    	let t3;
    	let small;
    	let t4;
    	let a;
    	let link_action;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			button = element("button");
    			button.textContent = "Log in";
    			t3 = space();
    			small = element("small");
    			t4 = text("No account?\n  ");
    			a = element("a");
    			a.textContent = "Sign Up";
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "name", "email");
    			attr_dev(input0, "placeholder", "Email");
    			attr_dev(input0, "class", "svelte-1wvgpqh");
    			add_location(input0, file, 41, 2, 907);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "pass");
    			attr_dev(input1, "placeholder", "Password");
    			attr_dev(input1, "class", "svelte-1wvgpqh");
    			add_location(input1, file, 42, 2, 984);
    			attr_dev(button, "class", "svelte-1wvgpqh");
    			add_location(button, file, 47, 2, 1085);
    			add_location(div, file, 40, 0, 899);
    			attr_dev(a, "href", "/signup");
    			add_location(a, file, 52, 2, 1158);
    			attr_dev(small, "class", "svelte-1wvgpqh");
    			add_location(small, file, 50, 0, 1134);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    				listen_dev(button, "click", /*logIn*/ ctx[2], false, false, false),
    				action_destroyer(link_action = link.call(null, a))
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input0);
    			set_input_value(input0, /*email*/ ctx[0]);
    			append_dev(div, t0);
    			append_dev(div, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(div, t1);
    			append_dev(div, button);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, small, anchor);
    			append_dev(small, t4);
    			append_dev(small, a);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*email*/ 1 && input0.value !== /*email*/ ctx[0]) {
    				set_input_value(input0, /*email*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(small);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $app_errors;
    	validate_store(app_errors, "app_errors");
    	component_subscribe($$self, app_errors, $$value => $$invalidate(3, $app_errors = $$value));
    	let email;
    	let password;

    	async function logIn() {
    		const response = await getData("/api/auth", { email, password });

    		if (response.errors) {
    			set_store_value(app_errors, $app_errors = [...$app_errors, ...response.errors]);
    		} else {
    			auth_token.set(response.token);
    			localStorage.setItem("auth_token", response.token);
    			push("/trips/new");
    		}
    	}

    	function input0_input_handler() {
    		email = this.value;
    		$$invalidate(0, email);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("email" in $$props) $$invalidate(0, email = $$props.email);
    		if ("password" in $$props) $$invalidate(1, password = $$props.password);
    		if ("$app_errors" in $$props) app_errors.set($app_errors = $$props.$app_errors);
    	};

    	return [
    		email,
    		password,
    		logIn,
    		$app_errors,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/routes/Signup.svelte generated by Svelte v3.16.7 */
    const file$1 = "src/routes/Signup.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let button;
    	let t3;
    	let small;
    	let t4;
    	let a;
    	let link_action;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			button = element("button");
    			button.textContent = "Sign Up";
    			t3 = space();
    			small = element("small");
    			t4 = text("Already have an account?\n  ");
    			a = element("a");
    			a.textContent = "Log in";
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "name", "email");
    			attr_dev(input0, "placeholder", "Email");
    			attr_dev(input0, "class", "svelte-1w8911u");
    			add_location(input0, file$1, 41, 2, 912);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "password");
    			attr_dev(input1, "placeholder", "Password");
    			attr_dev(input1, "class", "svelte-1w8911u");
    			add_location(input1, file$1, 42, 2, 989);
    			attr_dev(button, "class", "svelte-1w8911u");
    			add_location(button, file$1, 47, 2, 1094);
    			add_location(div, file$1, 40, 0, 904);
    			attr_dev(a, "href", "/login");
    			add_location(a, file$1, 52, 2, 1182);
    			attr_dev(small, "class", "svelte-1w8911u");
    			add_location(small, file$1, 50, 0, 1145);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    				listen_dev(button, "click", /*signUp*/ ctx[2], false, false, false),
    				action_destroyer(link_action = link.call(null, a))
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input0);
    			set_input_value(input0, /*email*/ ctx[0]);
    			append_dev(div, t0);
    			append_dev(div, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(div, t1);
    			append_dev(div, button);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, small, anchor);
    			append_dev(small, t4);
    			append_dev(small, a);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*email*/ 1 && input0.value !== /*email*/ ctx[0]) {
    				set_input_value(input0, /*email*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(small);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $app_errors;
    	validate_store(app_errors, "app_errors");
    	component_subscribe($$self, app_errors, $$value => $$invalidate(3, $app_errors = $$value));
    	let email;
    	let password;

    	async function signUp() {
    		const response = await postData("/api/users", { email, password });

    		if (response.errors) {
    			set_store_value(app_errors, $app_errors = [...$app_errors, ...response.errors]);
    		} else {
    			auth_token.set(response.token);
    			localStorage.setItem("auth_token", response.token);
    			push("/trips/new");
    		}
    	}

    	function input0_input_handler() {
    		email = this.value;
    		$$invalidate(0, email);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("email" in $$props) $$invalidate(0, email = $$props.email);
    		if ("password" in $$props) $$invalidate(1, password = $$props.password);
    		if ("$app_errors" in $$props) app_errors.set($app_errors = $$props.$app_errors);
    	};

    	return [
    		email,
    		password,
    		signUp,
    		$app_errors,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Signup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signup",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/routes/NotFound.svelte generated by Svelte v3.16.7 */
    const file$2 = "src/routes/NotFound.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let t0;
    	let br;
    	let t1;
    	let a;
    	let link_action;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("404 Not found\n  ");
    			br = element("br");
    			t1 = space();
    			a = element("a");
    			a.textContent = "Go home";
    			add_location(br, file$2, 13, 2, 444);
    			attr_dev(a, "href", "/");
    			add_location(a, file$2, 14, 2, 453);
    			attr_dev(div, "class", "svelte-7egzqe");
    			add_location(div, file$2, 11, 0, 420);
    			dispose = action_destroyer(link_action = link.call(null, a));
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, br);
    			append_dev(div, t1);
    			append_dev(div, a);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* node_modules/svelte-select/src/Item.svelte generated by Svelte v3.16.7 */

    const file$3 = "node_modules/svelte-select/src/Item.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let raw_value = /*getOptionLabel*/ ctx[0](/*item*/ ctx[1], /*filterText*/ ctx[2]) + "";
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "item " + /*itemClasses*/ ctx[3] + " svelte-64af15");
    			add_location(div, file$3, 61, 0, 2892);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = raw_value;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*getOptionLabel, item, filterText*/ 7 && raw_value !== (raw_value = /*getOptionLabel*/ ctx[0](/*item*/ ctx[1], /*filterText*/ ctx[2]) + "")) div.innerHTML = raw_value;
    			if (dirty & /*itemClasses*/ 8 && div_class_value !== (div_class_value = "item " + /*itemClasses*/ ctx[3] + " svelte-64af15")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { isActive = false } = $$props;
    	let { isFirst = false } = $$props;
    	let { isHover = false } = $$props;
    	let { getOptionLabel = undefined } = $$props;
    	let { item = undefined } = $$props;
    	let { filterText = "" } = $$props;
    	let itemClasses = "";
    	const writable_props = ["isActive", "isFirst", "isHover", "getOptionLabel", "item", "filterText"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Item> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("isActive" in $$props) $$invalidate(4, isActive = $$props.isActive);
    		if ("isFirst" in $$props) $$invalidate(5, isFirst = $$props.isFirst);
    		if ("isHover" in $$props) $$invalidate(6, isHover = $$props.isHover);
    		if ("getOptionLabel" in $$props) $$invalidate(0, getOptionLabel = $$props.getOptionLabel);
    		if ("item" in $$props) $$invalidate(1, item = $$props.item);
    		if ("filterText" in $$props) $$invalidate(2, filterText = $$props.filterText);
    	};

    	$$self.$capture_state = () => {
    		return {
    			isActive,
    			isFirst,
    			isHover,
    			getOptionLabel,
    			item,
    			filterText,
    			itemClasses
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("isActive" in $$props) $$invalidate(4, isActive = $$props.isActive);
    		if ("isFirst" in $$props) $$invalidate(5, isFirst = $$props.isFirst);
    		if ("isHover" in $$props) $$invalidate(6, isHover = $$props.isHover);
    		if ("getOptionLabel" in $$props) $$invalidate(0, getOptionLabel = $$props.getOptionLabel);
    		if ("item" in $$props) $$invalidate(1, item = $$props.item);
    		if ("filterText" in $$props) $$invalidate(2, filterText = $$props.filterText);
    		if ("itemClasses" in $$props) $$invalidate(3, itemClasses = $$props.itemClasses);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isActive, isFirst, isHover, item*/ 114) {
    			 {
    				const classes = [];

    				if (isActive) {
    					classes.push("active");
    				}

    				if (isFirst) {
    					classes.push("first");
    				}

    				if (isHover) {
    					classes.push("hover");
    				}

    				if (item.isGroupHeader) {
    					classes.push("groupHeader");
    				}

    				if (item.isGroupItem) {
    					classes.push("groupItem");
    				}

    				$$invalidate(3, itemClasses = classes.join(" "));
    			}
    		}
    	};

    	return [getOptionLabel, item, filterText, itemClasses, isActive, isFirst, isHover];
    }

    class Item extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$4, safe_not_equal, {
    			isActive: 4,
    			isFirst: 5,
    			isHover: 6,
    			getOptionLabel: 0,
    			item: 1,
    			filterText: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Item",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get isActive() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isActive(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFirst() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFirst(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isHover() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isHover(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getOptionLabel() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getOptionLabel(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get item() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterText() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterText(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-select/src/VirtualList.svelte generated by Svelte v3.16.7 */
    const file$4 = "node_modules/svelte-select/src/VirtualList.svelte";

    const get_default_slot_changes = dirty => ({
    	item: dirty & /*visible*/ 32,
    	i: dirty & /*visible*/ 32,
    	hoverItemIndex: dirty & /*hoverItemIndex*/ 2
    });

    const get_default_slot_context = ctx => ({
    	item: /*row*/ ctx[23].data,
    	i: /*row*/ ctx[23].index,
    	hoverItemIndex: /*hoverItemIndex*/ ctx[1]
    });

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    // (159:2) {#each visible as row (row.index)}
    function create_each_block(key_1, ctx) {
    	let svelte_virtual_list_row;
    	let t0;
    	let t1;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			svelte_virtual_list_row = element("svelte-virtual-list-row");

    			if (!default_slot) {
    				t0 = text("Missing template");
    			}

    			if (default_slot) default_slot.c();
    			t1 = space();
    			set_custom_element_data(svelte_virtual_list_row, "class", "svelte-9eeed7");
    			add_location(svelte_virtual_list_row, file$4, 159, 3, 4352);
    			this.first = svelte_virtual_list_row;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_virtual_list_row, anchor);

    			if (!default_slot) {
    				append_dev(svelte_virtual_list_row, t0);
    			}

    			if (default_slot) {
    				default_slot.m(svelte_virtual_list_row, null);
    			}

    			append_dev(svelte_virtual_list_row, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty & /*$$scope, visible, hoverItemIndex*/ 262178) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context), get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_virtual_list_row);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(159:2) {#each visible as row (row.index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let svelte_virtual_list_viewport;
    	let svelte_virtual_list_contents;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let svelte_virtual_list_viewport_resize_listener;
    	let current;
    	let dispose;
    	let each_value = /*visible*/ ctx[5];
    	const get_key = ctx => /*row*/ ctx[23].index;

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			svelte_virtual_list_viewport = element("svelte-virtual-list-viewport");
    			svelte_virtual_list_contents = element("svelte-virtual-list-contents");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(svelte_virtual_list_contents, "padding-top", /*top*/ ctx[6] + "px");
    			set_style(svelte_virtual_list_contents, "padding-bottom", /*bottom*/ ctx[7] + "px");
    			set_custom_element_data(svelte_virtual_list_contents, "class", "svelte-9eeed7");
    			add_location(svelte_virtual_list_contents, file$4, 157, 1, 4202);
    			set_style(svelte_virtual_list_viewport, "height", /*height*/ ctx[0]);
    			set_custom_element_data(svelte_virtual_list_viewport, "class", "svelte-9eeed7");
    			add_render_callback(() => /*svelte_virtual_list_viewport_elementresize_handler*/ ctx[22].call(svelte_virtual_list_viewport));
    			add_location(svelte_virtual_list_viewport, file$4, 155, 0, 4060);
    			dispose = listen_dev(svelte_virtual_list_viewport, "scroll", /*handle_scroll*/ ctx[8], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_virtual_list_viewport, anchor);
    			append_dev(svelte_virtual_list_viewport, svelte_virtual_list_contents);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svelte_virtual_list_contents, null);
    			}

    			/*svelte_virtual_list_contents_binding*/ ctx[20](svelte_virtual_list_contents);
    			/*svelte_virtual_list_viewport_binding*/ ctx[21](svelte_virtual_list_viewport);
    			svelte_virtual_list_viewport_resize_listener = add_resize_listener(svelte_virtual_list_viewport, /*svelte_virtual_list_viewport_elementresize_handler*/ ctx[22].bind(svelte_virtual_list_viewport));
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const each_value = /*visible*/ ctx[5];
    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, svelte_virtual_list_contents, outro_and_destroy_block, create_each_block, null, get_each_context);
    			check_outros();

    			if (!current || dirty & /*top*/ 64) {
    				set_style(svelte_virtual_list_contents, "padding-top", /*top*/ ctx[6] + "px");
    			}

    			if (!current || dirty & /*bottom*/ 128) {
    				set_style(svelte_virtual_list_contents, "padding-bottom", /*bottom*/ ctx[7] + "px");
    			}

    			if (!current || dirty & /*height*/ 1) {
    				set_style(svelte_virtual_list_viewport, "height", /*height*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_virtual_list_viewport);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*svelte_virtual_list_contents_binding*/ ctx[20](null);
    			/*svelte_virtual_list_viewport_binding*/ ctx[21](null);
    			svelte_virtual_list_viewport_resize_listener.cancel();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { items = undefined } = $$props;
    	let { height = "100%" } = $$props;
    	let { itemHeight = 40 } = $$props;
    	let { hoverItemIndex = 0 } = $$props;
    	let { start = 0 } = $$props;
    	let { end = 0 } = $$props;
    	let height_map = [];
    	let rows;
    	let viewport;
    	let contents;
    	let viewport_height = 0;
    	let visible;
    	let mounted;
    	let top = 0;
    	let bottom = 0;
    	let average_height;

    	async function refresh(items, viewport_height, itemHeight) {
    		const { scrollTop } = viewport;
    		await tick();
    		let content_height = top - scrollTop;
    		let i = start;

    		while (content_height < viewport_height && i < items.length) {
    			let row = rows[i - start];

    			if (!row) {
    				$$invalidate(10, end = i + 1);
    				await tick();
    				row = rows[i - start];
    			}

    			const row_height = height_map[i] = itemHeight || row.offsetHeight;
    			content_height += row_height;
    			i += 1;
    		}

    		$$invalidate(10, end = i);
    		const remaining = items.length - end;
    		average_height = (top + content_height) / end;
    		$$invalidate(7, bottom = remaining * average_height);
    		height_map.length = items.length;
    		$$invalidate(2, viewport.scrollTop = 0, viewport);
    	}

    	async function handle_scroll() {
    		const { scrollTop } = viewport;
    		const old_start = start;

    		for (let v = 0; v < rows.length; v += 1) {
    			height_map[start + v] = itemHeight || rows[v].offsetHeight;
    		}

    		let i = 0;
    		let y = 0;

    		while (i < items.length) {
    			const row_height = height_map[i] || average_height;

    			if (y + row_height > scrollTop) {
    				$$invalidate(9, start = i);
    				$$invalidate(6, top = y);
    				break;
    			}

    			y += row_height;
    			i += 1;
    		}

    		while (i < items.length) {
    			y += height_map[i] || average_height;
    			i += 1;
    			if (y > scrollTop + viewport_height) break;
    		}

    		$$invalidate(10, end = i);
    		const remaining = items.length - end;
    		average_height = y / end;
    		while (i < items.length) height_map[i++] = average_height;
    		$$invalidate(7, bottom = remaining * average_height);

    		if (start < old_start) {
    			await tick();
    			let expected_height = 0;
    			let actual_height = 0;

    			for (let i = start; i < old_start; i += 1) {
    				if (rows[i - start]) {
    					expected_height += height_map[i];
    					actual_height += itemHeight || rows[i - start].offsetHeight;
    				}
    			}

    			const d = actual_height - expected_height;
    			viewport.scrollTo(0, scrollTop + d);
    		}
    	}

    	onMount(() => {
    		rows = contents.getElementsByTagName("svelte-virtual-list-row");
    		$$invalidate(15, mounted = true);
    	});

    	const writable_props = ["items", "height", "itemHeight", "hoverItemIndex", "start", "end"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<VirtualList> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	function svelte_virtual_list_contents_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(3, contents = $$value);
    		});
    	}

    	function svelte_virtual_list_viewport_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(2, viewport = $$value);
    		});
    	}

    	function svelte_virtual_list_viewport_elementresize_handler() {
    		viewport_height = this.offsetHeight;
    		$$invalidate(4, viewport_height);
    	}

    	$$self.$set = $$props => {
    		if ("items" in $$props) $$invalidate(11, items = $$props.items);
    		if ("height" in $$props) $$invalidate(0, height = $$props.height);
    		if ("itemHeight" in $$props) $$invalidate(12, itemHeight = $$props.itemHeight);
    		if ("hoverItemIndex" in $$props) $$invalidate(1, hoverItemIndex = $$props.hoverItemIndex);
    		if ("start" in $$props) $$invalidate(9, start = $$props.start);
    		if ("end" in $$props) $$invalidate(10, end = $$props.end);
    		if ("$$scope" in $$props) $$invalidate(18, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {
    			items,
    			height,
    			itemHeight,
    			hoverItemIndex,
    			start,
    			end,
    			height_map,
    			rows,
    			viewport,
    			contents,
    			viewport_height,
    			visible,
    			mounted,
    			top,
    			bottom,
    			average_height
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("items" in $$props) $$invalidate(11, items = $$props.items);
    		if ("height" in $$props) $$invalidate(0, height = $$props.height);
    		if ("itemHeight" in $$props) $$invalidate(12, itemHeight = $$props.itemHeight);
    		if ("hoverItemIndex" in $$props) $$invalidate(1, hoverItemIndex = $$props.hoverItemIndex);
    		if ("start" in $$props) $$invalidate(9, start = $$props.start);
    		if ("end" in $$props) $$invalidate(10, end = $$props.end);
    		if ("height_map" in $$props) height_map = $$props.height_map;
    		if ("rows" in $$props) rows = $$props.rows;
    		if ("viewport" in $$props) $$invalidate(2, viewport = $$props.viewport);
    		if ("contents" in $$props) $$invalidate(3, contents = $$props.contents);
    		if ("viewport_height" in $$props) $$invalidate(4, viewport_height = $$props.viewport_height);
    		if ("visible" in $$props) $$invalidate(5, visible = $$props.visible);
    		if ("mounted" in $$props) $$invalidate(15, mounted = $$props.mounted);
    		if ("top" in $$props) $$invalidate(6, top = $$props.top);
    		if ("bottom" in $$props) $$invalidate(7, bottom = $$props.bottom);
    		if ("average_height" in $$props) average_height = $$props.average_height;
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*items, start, end*/ 3584) {
    			 $$invalidate(5, visible = items.slice(start, end).map((data, i) => {
    				return { index: i + start, data };
    			}));
    		}

    		if ($$self.$$.dirty & /*mounted, items, viewport_height, itemHeight*/ 38928) {
    			 if (mounted) refresh(items, viewport_height, itemHeight);
    		}
    	};

    	return [
    		height,
    		hoverItemIndex,
    		viewport,
    		contents,
    		viewport_height,
    		visible,
    		top,
    		bottom,
    		handle_scroll,
    		start,
    		end,
    		items,
    		itemHeight,
    		height_map,
    		rows,
    		mounted,
    		average_height,
    		refresh,
    		$$scope,
    		$$slots,
    		svelte_virtual_list_contents_binding,
    		svelte_virtual_list_viewport_binding,
    		svelte_virtual_list_viewport_elementresize_handler
    	];
    }

    class VirtualList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$5, safe_not_equal, {
    			items: 11,
    			height: 0,
    			itemHeight: 12,
    			hoverItemIndex: 1,
    			start: 9,
    			end: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VirtualList",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get items() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemHeight() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemHeight(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hoverItemIndex() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hoverItemIndex(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get end() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set end(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-select/src/List.svelte generated by Svelte v3.16.7 */
    const file$5 = "node_modules/svelte-select/src/List.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	child_ctx[36] = i;
    	return child_ctx;
    }

    // (210:0) {#if isVirtualList}
    function create_if_block_3(ctx) {
    	let div;
    	let current;

    	const virtuallist = new VirtualList({
    			props: {
    				items: /*items*/ ctx[4],
    				itemHeight: /*itemHeight*/ ctx[7],
    				$$slots: {
    					default: [
    						create_default_slot,
    						({ item, i }) => ({ 34: item, 36: i }),
    						({ item, i }) => [0, (item ? 8 : 0) | (i ? 32 : 0)]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(virtuallist.$$.fragment);
    			attr_dev(div, "class", "listContainer virtualList svelte-ip16yo");
    			add_location(div, file$5, 210, 0, 5850);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(virtuallist, div, null);
    			/*div_binding*/ ctx[30](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const virtuallist_changes = {};
    			if (dirty[0] & /*items*/ 16) virtuallist_changes.items = /*items*/ ctx[4];
    			if (dirty[0] & /*itemHeight*/ 128) virtuallist_changes.itemHeight = /*itemHeight*/ ctx[7];

    			if (dirty[0] & /*Item, filterText, getOptionLabel, selectedValue, optionIdentifier, hoverItemIndex, items*/ 4918 | dirty[1] & /*$$scope, item, i*/ 104) {
    				virtuallist_changes.$$scope = { dirty, ctx };
    			}

    			virtuallist.$set(virtuallist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(virtuallist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(virtuallist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(virtuallist);
    			/*div_binding*/ ctx[30](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(210:0) {#if isVirtualList}",
    		ctx
    	});

    	return block;
    }

    // (213:2) <VirtualList {items} {itemHeight} let:item let:i>
    function create_default_slot(ctx) {
    	let div;
    	let current;
    	let dispose;
    	var switch_value = /*Item*/ ctx[2];

    	function switch_props(ctx) {
    		return {
    			props: {
    				item: /*item*/ ctx[34],
    				filterText: /*filterText*/ ctx[12],
    				getOptionLabel: /*getOptionLabel*/ ctx[5],
    				isFirst: isItemFirst(/*i*/ ctx[36]),
    				isActive: isItemActive(/*item*/ ctx[34], /*selectedValue*/ ctx[8], /*optionIdentifier*/ ctx[9]),
    				isHover: isItemHover(/*hoverItemIndex*/ ctx[1], /*item*/ ctx[34], /*i*/ ctx[36], /*items*/ ctx[4])
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	function mouseover_handler(...args) {
    		return /*mouseover_handler*/ ctx[28](/*i*/ ctx[36], ...args);
    	}

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[29](/*item*/ ctx[34], /*i*/ ctx[36], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "listItem");
    			add_location(div, file$5, 214, 4, 5972);

    			dispose = [
    				listen_dev(div, "mouseover", mouseover_handler, false, false, false),
    				listen_dev(div, "click", click_handler, false, false, false)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const switch_instance_changes = {};
    			if (dirty[1] & /*item*/ 8) switch_instance_changes.item = /*item*/ ctx[34];
    			if (dirty[0] & /*filterText*/ 4096) switch_instance_changes.filterText = /*filterText*/ ctx[12];
    			if (dirty[0] & /*getOptionLabel*/ 32) switch_instance_changes.getOptionLabel = /*getOptionLabel*/ ctx[5];
    			if (dirty[1] & /*i*/ 32) switch_instance_changes.isFirst = isItemFirst(/*i*/ ctx[36]);
    			if (dirty[0] & /*selectedValue, optionIdentifier*/ 768 | dirty[1] & /*item*/ 8) switch_instance_changes.isActive = isItemActive(/*item*/ ctx[34], /*selectedValue*/ ctx[8], /*optionIdentifier*/ ctx[9]);
    			if (dirty[0] & /*hoverItemIndex, items*/ 18 | dirty[1] & /*item, i*/ 40) switch_instance_changes.isHover = isItemHover(/*hoverItemIndex*/ ctx[1], /*item*/ ctx[34], /*i*/ ctx[36], /*items*/ ctx[4]);

    			if (switch_value !== (switch_value = /*Item*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(213:2) <VirtualList {items} {itemHeight} let:item let:i>",
    		ctx
    	});

    	return block;
    }

    // (232:0) {#if !isVirtualList}
    function create_if_block(ctx) {
    	let div;
    	let current;
    	let each_value = /*items*/ ctx[4];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_1(ctx);
    		each_1_else.c();
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "listContainer svelte-ip16yo");
    			add_location(div, file$5, 232, 0, 6482);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div, null);
    			}

    			/*div_binding_1*/ ctx[33](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items, getGroupHeaderLabel, handleHover, handleClick, Item, filterText, getOptionLabel, selectedValue, optionIdentifier, hoverItemIndex, hideEmptyState, noOptionsMessage*/ 32630) {
    				each_value = /*items*/ ctx[4];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!each_value.length && each_1_else) {
    				each_1_else.p(ctx, dirty);
    			} else if (!each_value.length) {
    				each_1_else = create_else_block_1(ctx);
    				each_1_else.c();
    				each_1_else.m(div, null);
    			} else if (each_1_else) {
    				each_1_else.d(1);
    				each_1_else = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    			/*div_binding_1*/ ctx[33](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(232:0) {#if !isVirtualList}",
    		ctx
    	});

    	return block;
    }

    // (254:2) {:else}
    function create_else_block_1(ctx) {
    	let if_block_anchor;
    	let if_block = !/*hideEmptyState*/ ctx[10] && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*hideEmptyState*/ ctx[10]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(254:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (255:4) {#if !hideEmptyState}
    function create_if_block_2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*noOptionsMessage*/ ctx[11]);
    			attr_dev(div, "class", "empty svelte-ip16yo");
    			add_location(div, file$5, 255, 6, 7186);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*noOptionsMessage*/ 2048) set_data_dev(t, /*noOptionsMessage*/ ctx[11]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(255:4) {#if !hideEmptyState}",
    		ctx
    	});

    	return block;
    }

    // (237:4) { :else }
    function create_else_block(ctx) {
    	let div;
    	let t;
    	let current;
    	let dispose;
    	var switch_value = /*Item*/ ctx[2];

    	function switch_props(ctx) {
    		return {
    			props: {
    				item: /*item*/ ctx[34],
    				filterText: /*filterText*/ ctx[12],
    				getOptionLabel: /*getOptionLabel*/ ctx[5],
    				isFirst: isItemFirst(/*i*/ ctx[36]),
    				isActive: isItemActive(/*item*/ ctx[34], /*selectedValue*/ ctx[8], /*optionIdentifier*/ ctx[9]),
    				isHover: isItemHover(/*hoverItemIndex*/ ctx[1], /*item*/ ctx[34], /*i*/ ctx[36], /*items*/ ctx[4])
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	function mouseover_handler_1(...args) {
    		return /*mouseover_handler_1*/ ctx[31](/*i*/ ctx[36], ...args);
    	}

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[32](/*item*/ ctx[34], /*i*/ ctx[36], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "listItem");
    			add_location(div, file$5, 237, 4, 6696);

    			dispose = [
    				listen_dev(div, "mouseover", mouseover_handler_1, false, false, false),
    				listen_dev(div, "click", click_handler_1, false, false, false)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const switch_instance_changes = {};
    			if (dirty[0] & /*items*/ 16) switch_instance_changes.item = /*item*/ ctx[34];
    			if (dirty[0] & /*filterText*/ 4096) switch_instance_changes.filterText = /*filterText*/ ctx[12];
    			if (dirty[0] & /*getOptionLabel*/ 32) switch_instance_changes.getOptionLabel = /*getOptionLabel*/ ctx[5];
    			if (dirty[0] & /*items, selectedValue, optionIdentifier*/ 784) switch_instance_changes.isActive = isItemActive(/*item*/ ctx[34], /*selectedValue*/ ctx[8], /*optionIdentifier*/ ctx[9]);
    			if (dirty[0] & /*hoverItemIndex, items*/ 18) switch_instance_changes.isHover = isItemHover(/*hoverItemIndex*/ ctx[1], /*item*/ ctx[34], /*i*/ ctx[36], /*items*/ ctx[4]);

    			if (switch_value !== (switch_value = /*Item*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, t);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(237:4) { :else }",
    		ctx
    	});

    	return block;
    }

    // (235:4) {#if item.isGroupHeader && !item.isSelectable}
    function create_if_block_1(ctx) {
    	let div;
    	let t_value = /*getGroupHeaderLabel*/ ctx[6](/*item*/ ctx[34]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "listGroupTitle svelte-ip16yo");
    			add_location(div, file$5, 235, 6, 6616);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*getGroupHeaderLabel, items*/ 80 && t_value !== (t_value = /*getGroupHeaderLabel*/ ctx[6](/*item*/ ctx[34]) + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(235:4) {#if item.isGroupHeader && !item.isSelectable}",
    		ctx
    	});

    	return block;
    }

    // (234:2) {#each items as item, i}
    function create_each_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[34].isGroupHeader && !/*item*/ ctx[34].isSelectable) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(234:2) {#each items as item, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let dispose;
    	let if_block0 = /*isVirtualList*/ ctx[3] && create_if_block_3(ctx);
    	let if_block1 = !/*isVirtualList*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			dispose = listen_dev(window, "keydown", /*handleKeyDown*/ ctx[15], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*isVirtualList*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*isVirtualList*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function isItemActive(item, selectedValue, optionIdentifier) {
    	return selectedValue && selectedValue[optionIdentifier] === item[optionIdentifier];
    }

    function isItemFirst(itemIndex) {
    	return itemIndex === 0;
    }

    function isItemHover(hoverItemIndex, item, itemIndex, items) {
    	return hoverItemIndex === itemIndex || items.length === 1;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { container = undefined } = $$props;
    	let { Item: Item$1 = Item } = $$props;
    	let { isVirtualList = false } = $$props;
    	let { items = [] } = $$props;

    	let { getOptionLabel = (option, filterText) => {
    		if (option) return option.isCreator
    		? `Create \"${filterText}\"`
    		: option.label;
    	} } = $$props;

    	let { getGroupHeaderLabel = option => {
    		return option.label;
    	} } = $$props;

    	let { itemHeight = 40 } = $$props;
    	let { hoverItemIndex = 0 } = $$props;
    	let { selectedValue = undefined } = $$props;
    	let { optionIdentifier = "value" } = $$props;
    	let { hideEmptyState = false } = $$props;
    	let { noOptionsMessage = "No options" } = $$props;
    	let { isMulti = false } = $$props;
    	let { activeItemIndex = 0 } = $$props;
    	let { filterText = "" } = $$props;
    	let isScrollingTimer = 0;
    	let isScrolling = false;
    	let prev_items;
    	let prev_activeItemIndex;
    	let prev_selectedValue;

    	onMount(() => {
    		if (items.length > 0 && !isMulti && selectedValue) {
    			const _hoverItemIndex = items.findIndex(item => item[optionIdentifier] === selectedValue[optionIdentifier]);

    			if (_hoverItemIndex) {
    				$$invalidate(1, hoverItemIndex = _hoverItemIndex);
    			}
    		}

    		scrollToActiveItem("active");

    		container.addEventListener(
    			"scroll",
    			() => {
    				clearTimeout(isScrollingTimer);

    				isScrollingTimer = setTimeout(
    					() => {
    						isScrolling = false;
    					},
    					100
    				);
    			},
    			false
    		);
    	});

    	onDestroy(() => {
    		
    	});

    	beforeUpdate(() => {
    		if (items !== prev_items && items.length > 0) {
    			$$invalidate(1, hoverItemIndex = 0);
    		}

    		prev_items = items;
    		prev_activeItemIndex = activeItemIndex;
    		prev_selectedValue = selectedValue;
    	});

    	function handleSelect(item) {
    		if (item.isCreator) return;
    		dispatch("itemSelected", item);
    	}

    	function handleHover(i) {
    		if (isScrolling) return;
    		$$invalidate(1, hoverItemIndex = i);
    	}

    	function handleClick(args) {
    		const { item, i, event } = args;
    		event.stopPropagation();
    		if (selectedValue && !isMulti && selectedValue[optionIdentifier] === item[optionIdentifier]) return closeList();

    		if (item.isCreator) {
    			dispatch("itemCreated", filterText);
    		} else {
    			$$invalidate(16, activeItemIndex = i);
    			$$invalidate(1, hoverItemIndex = i);
    			handleSelect(item);
    		}
    	}

    	function closeList() {
    		dispatch("closeList");
    	}

    	async function updateHoverItem(increment) {
    		if (isVirtualList) return;
    		let isNonSelectableItem = true;

    		while (isNonSelectableItem) {
    			if (increment > 0 && hoverItemIndex === items.length - 1) {
    				$$invalidate(1, hoverItemIndex = 0);
    			} else if (increment < 0 && hoverItemIndex === 0) {
    				$$invalidate(1, hoverItemIndex = items.length - 1);
    			} else {
    				$$invalidate(1, hoverItemIndex = hoverItemIndex + increment);
    			}

    			isNonSelectableItem = items[hoverItemIndex].isGroupHeader && !items[hoverItemIndex].isSelectable;
    		}

    		await tick();
    		scrollToActiveItem("hover");
    	}

    	function handleKeyDown(e) {
    		switch (e.key) {
    			case "ArrowDown":
    				e.preventDefault();
    				items.length && updateHoverItem(1);
    				break;
    			case "ArrowUp":
    				e.preventDefault();
    				items.length && updateHoverItem(-1);
    				break;
    			case "Enter":
    				e.preventDefault();
    				if (items.length === 0) break;
    				const hoverItem = items[hoverItemIndex];
    				if (selectedValue && !isMulti && selectedValue[optionIdentifier] === hoverItem[optionIdentifier]) {
    					closeList();
    					break;
    				}
    				if (hoverItem.isCreator) {
    					dispatch("itemCreated", filterText);
    				} else {
    					$$invalidate(16, activeItemIndex = hoverItemIndex);
    					handleSelect(items[hoverItemIndex]);
    				}
    				break;
    			case "Tab":
    				e.preventDefault();
    				if (items.length === 0) break;
    				if (selectedValue && selectedValue[optionIdentifier] === items[hoverItemIndex][optionIdentifier]) return closeList();
    				$$invalidate(16, activeItemIndex = hoverItemIndex);
    				handleSelect(items[hoverItemIndex]);
    				break;
    		}
    	}

    	function scrollToActiveItem(className) {
    		if (isVirtualList || !container) return;
    		let offsetBounding;
    		const focusedElemBounding = container.querySelector(`.listItem .${className}`);

    		if (focusedElemBounding) {
    			offsetBounding = container.getBoundingClientRect().bottom - focusedElemBounding.getBoundingClientRect().bottom;
    		}

    		$$invalidate(0, container.scrollTop -= offsetBounding, container);
    	}

    	
    	

    	const writable_props = [
    		"container",
    		"Item",
    		"isVirtualList",
    		"items",
    		"getOptionLabel",
    		"getGroupHeaderLabel",
    		"itemHeight",
    		"hoverItemIndex",
    		"selectedValue",
    		"optionIdentifier",
    		"hideEmptyState",
    		"noOptionsMessage",
    		"isMulti",
    		"activeItemIndex",
    		"filterText"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	const mouseover_handler = i => handleHover(i);
    	const click_handler = (item, i, event) => handleClick({ item, i, event });

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(0, container = $$value);
    		});
    	}

    	const mouseover_handler_1 = i => handleHover(i);
    	const click_handler_1 = (item, i, event) => handleClick({ item, i, event });

    	function div_binding_1($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(0, container = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("container" in $$props) $$invalidate(0, container = $$props.container);
    		if ("Item" in $$props) $$invalidate(2, Item$1 = $$props.Item);
    		if ("isVirtualList" in $$props) $$invalidate(3, isVirtualList = $$props.isVirtualList);
    		if ("items" in $$props) $$invalidate(4, items = $$props.items);
    		if ("getOptionLabel" in $$props) $$invalidate(5, getOptionLabel = $$props.getOptionLabel);
    		if ("getGroupHeaderLabel" in $$props) $$invalidate(6, getGroupHeaderLabel = $$props.getGroupHeaderLabel);
    		if ("itemHeight" in $$props) $$invalidate(7, itemHeight = $$props.itemHeight);
    		if ("hoverItemIndex" in $$props) $$invalidate(1, hoverItemIndex = $$props.hoverItemIndex);
    		if ("selectedValue" in $$props) $$invalidate(8, selectedValue = $$props.selectedValue);
    		if ("optionIdentifier" in $$props) $$invalidate(9, optionIdentifier = $$props.optionIdentifier);
    		if ("hideEmptyState" in $$props) $$invalidate(10, hideEmptyState = $$props.hideEmptyState);
    		if ("noOptionsMessage" in $$props) $$invalidate(11, noOptionsMessage = $$props.noOptionsMessage);
    		if ("isMulti" in $$props) $$invalidate(17, isMulti = $$props.isMulti);
    		if ("activeItemIndex" in $$props) $$invalidate(16, activeItemIndex = $$props.activeItemIndex);
    		if ("filterText" in $$props) $$invalidate(12, filterText = $$props.filterText);
    	};

    	$$self.$capture_state = () => {
    		return {
    			container,
    			Item: Item$1,
    			isVirtualList,
    			items,
    			getOptionLabel,
    			getGroupHeaderLabel,
    			itemHeight,
    			hoverItemIndex,
    			selectedValue,
    			optionIdentifier,
    			hideEmptyState,
    			noOptionsMessage,
    			isMulti,
    			activeItemIndex,
    			filterText,
    			isScrollingTimer,
    			isScrolling,
    			prev_items,
    			prev_activeItemIndex,
    			prev_selectedValue
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("container" in $$props) $$invalidate(0, container = $$props.container);
    		if ("Item" in $$props) $$invalidate(2, Item$1 = $$props.Item);
    		if ("isVirtualList" in $$props) $$invalidate(3, isVirtualList = $$props.isVirtualList);
    		if ("items" in $$props) $$invalidate(4, items = $$props.items);
    		if ("getOptionLabel" in $$props) $$invalidate(5, getOptionLabel = $$props.getOptionLabel);
    		if ("getGroupHeaderLabel" in $$props) $$invalidate(6, getGroupHeaderLabel = $$props.getGroupHeaderLabel);
    		if ("itemHeight" in $$props) $$invalidate(7, itemHeight = $$props.itemHeight);
    		if ("hoverItemIndex" in $$props) $$invalidate(1, hoverItemIndex = $$props.hoverItemIndex);
    		if ("selectedValue" in $$props) $$invalidate(8, selectedValue = $$props.selectedValue);
    		if ("optionIdentifier" in $$props) $$invalidate(9, optionIdentifier = $$props.optionIdentifier);
    		if ("hideEmptyState" in $$props) $$invalidate(10, hideEmptyState = $$props.hideEmptyState);
    		if ("noOptionsMessage" in $$props) $$invalidate(11, noOptionsMessage = $$props.noOptionsMessage);
    		if ("isMulti" in $$props) $$invalidate(17, isMulti = $$props.isMulti);
    		if ("activeItemIndex" in $$props) $$invalidate(16, activeItemIndex = $$props.activeItemIndex);
    		if ("filterText" in $$props) $$invalidate(12, filterText = $$props.filterText);
    		if ("isScrollingTimer" in $$props) isScrollingTimer = $$props.isScrollingTimer;
    		if ("isScrolling" in $$props) isScrolling = $$props.isScrolling;
    		if ("prev_items" in $$props) prev_items = $$props.prev_items;
    		if ("prev_activeItemIndex" in $$props) prev_activeItemIndex = $$props.prev_activeItemIndex;
    		if ("prev_selectedValue" in $$props) prev_selectedValue = $$props.prev_selectedValue;
    	};

    	return [
    		container,
    		hoverItemIndex,
    		Item$1,
    		isVirtualList,
    		items,
    		getOptionLabel,
    		getGroupHeaderLabel,
    		itemHeight,
    		selectedValue,
    		optionIdentifier,
    		hideEmptyState,
    		noOptionsMessage,
    		filterText,
    		handleHover,
    		handleClick,
    		handleKeyDown,
    		activeItemIndex,
    		isMulti,
    		isScrollingTimer,
    		isScrolling,
    		prev_items,
    		prev_activeItemIndex,
    		prev_selectedValue,
    		dispatch,
    		handleSelect,
    		closeList,
    		updateHoverItem,
    		scrollToActiveItem,
    		mouseover_handler,
    		click_handler,
    		div_binding,
    		mouseover_handler_1,
    		click_handler_1,
    		div_binding_1
    	];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$5,
    			create_fragment$6,
    			safe_not_equal,
    			{
    				container: 0,
    				Item: 2,
    				isVirtualList: 3,
    				items: 4,
    				getOptionLabel: 5,
    				getGroupHeaderLabel: 6,
    				itemHeight: 7,
    				hoverItemIndex: 1,
    				selectedValue: 8,
    				optionIdentifier: 9,
    				hideEmptyState: 10,
    				noOptionsMessage: 11,
    				isMulti: 17,
    				activeItemIndex: 16,
    				filterText: 12
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get container() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Item() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Item(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isVirtualList() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isVirtualList(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getOptionLabel() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getOptionLabel(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getGroupHeaderLabel() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getGroupHeaderLabel(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemHeight() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemHeight(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hoverItemIndex() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hoverItemIndex(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedValue() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedValue(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get optionIdentifier() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set optionIdentifier(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideEmptyState() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideEmptyState(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noOptionsMessage() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noOptionsMessage(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isMulti() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isMulti(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeItemIndex() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeItemIndex(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterText() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterText(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-select/src/Selection.svelte generated by Svelte v3.16.7 */

    const file$6 = "node_modules/svelte-select/src/Selection.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let raw_value = /*getSelectionLabel*/ ctx[0](/*item*/ ctx[1]) + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "selection svelte-1s1l1cg");
    			add_location(div, file$6, 14, 0, 708);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = raw_value;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*getSelectionLabel, item*/ 3 && raw_value !== (raw_value = /*getSelectionLabel*/ ctx[0](/*item*/ ctx[1]) + "")) div.innerHTML = raw_value;		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { getSelectionLabel = undefined } = $$props;
    	let { item = undefined } = $$props;
    	const writable_props = ["getSelectionLabel", "item"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Selection> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("getSelectionLabel" in $$props) $$invalidate(0, getSelectionLabel = $$props.getSelectionLabel);
    		if ("item" in $$props) $$invalidate(1, item = $$props.item);
    	};

    	$$self.$capture_state = () => {
    		return { getSelectionLabel, item };
    	};

    	$$self.$inject_state = $$props => {
    		if ("getSelectionLabel" in $$props) $$invalidate(0, getSelectionLabel = $$props.getSelectionLabel);
    		if ("item" in $$props) $$invalidate(1, item = $$props.item);
    	};

    	return [getSelectionLabel, item];
    }

    class Selection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$7, safe_not_equal, { getSelectionLabel: 0, item: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Selection",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get getSelectionLabel() {
    		throw new Error("<Selection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getSelectionLabel(value) {
    		throw new Error("<Selection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get item() {
    		throw new Error("<Selection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Selection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-select/src/MultiSelection.svelte generated by Svelte v3.16.7 */
    const file$7 = "node_modules/svelte-select/src/MultiSelection.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (22:2) {#if !isDisabled}
    function create_if_block$1(ctx) {
    	let div;
    	let svg;
    	let path;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[6](/*i*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124 l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z");
    			add_location(path, file$7, 24, 6, 806);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "-2 -2 50 50");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "role", "presentation");
    			attr_dev(svg, "class", "svelte-ukpveo");
    			add_location(svg, file$7, 23, 4, 707);
    			attr_dev(div, "class", "multiSelectItem_clear svelte-ukpveo");
    			add_location(div, file$7, 22, 2, 623);
    			dispose = listen_dev(div, "click", click_handler, false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(22:2) {#if !isDisabled}",
    		ctx
    	});

    	return block;
    }

    // (17:0) {#each selectedValue as value, i}
    function create_each_block$2(ctx) {
    	let div1;
    	let div0;
    	let raw_value = /*getSelectionLabel*/ ctx[3](/*value*/ ctx[7]) + "";
    	let t0;
    	let t1;
    	let div1_class_value;
    	let if_block = !/*isDisabled*/ ctx[2] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			attr_dev(div0, "class", "multiSelectItem_label svelte-ukpveo");
    			add_location(div0, file$7, 18, 2, 519);

    			attr_dev(div1, "class", div1_class_value = "multiSelectItem " + (/*activeSelectedValue*/ ctx[1] === /*i*/ ctx[9]
    			? "active"
    			: "") + " " + (/*isDisabled*/ ctx[2] ? "disabled" : "") + " svelte-ukpveo");

    			add_location(div1, file$7, 17, 0, 412);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			div0.innerHTML = raw_value;
    			append_dev(div1, t0);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*getSelectionLabel, selectedValue*/ 9 && raw_value !== (raw_value = /*getSelectionLabel*/ ctx[3](/*value*/ ctx[7]) + "")) div0.innerHTML = raw_value;
    			if (!/*isDisabled*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div1, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*activeSelectedValue, isDisabled*/ 6 && div1_class_value !== (div1_class_value = "multiSelectItem " + (/*activeSelectedValue*/ ctx[1] === /*i*/ ctx[9]
    			? "active"
    			: "") + " " + (/*isDisabled*/ ctx[2] ? "disabled" : "") + " svelte-ukpveo")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(17:0) {#each selectedValue as value, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let each_1_anchor;
    	let each_value = /*selectedValue*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activeSelectedValue, isDisabled, handleClear, getSelectionLabel, selectedValue*/ 31) {
    				each_value = /*selectedValue*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { selectedValue = [] } = $$props;
    	let { activeSelectedValue = undefined } = $$props;
    	let { isDisabled = false } = $$props;
    	let { getSelectionLabel = undefined } = $$props;

    	function handleClear(i, event) {
    		event.stopPropagation();
    		dispatch("multiItemClear", { i });
    	}

    	const writable_props = ["selectedValue", "activeSelectedValue", "isDisabled", "getSelectionLabel"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MultiSelection> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (i, event) => handleClear(i, event);

    	$$self.$set = $$props => {
    		if ("selectedValue" in $$props) $$invalidate(0, selectedValue = $$props.selectedValue);
    		if ("activeSelectedValue" in $$props) $$invalidate(1, activeSelectedValue = $$props.activeSelectedValue);
    		if ("isDisabled" in $$props) $$invalidate(2, isDisabled = $$props.isDisabled);
    		if ("getSelectionLabel" in $$props) $$invalidate(3, getSelectionLabel = $$props.getSelectionLabel);
    	};

    	$$self.$capture_state = () => {
    		return {
    			selectedValue,
    			activeSelectedValue,
    			isDisabled,
    			getSelectionLabel
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("selectedValue" in $$props) $$invalidate(0, selectedValue = $$props.selectedValue);
    		if ("activeSelectedValue" in $$props) $$invalidate(1, activeSelectedValue = $$props.activeSelectedValue);
    		if ("isDisabled" in $$props) $$invalidate(2, isDisabled = $$props.isDisabled);
    		if ("getSelectionLabel" in $$props) $$invalidate(3, getSelectionLabel = $$props.getSelectionLabel);
    	};

    	return [
    		selectedValue,
    		activeSelectedValue,
    		isDisabled,
    		getSelectionLabel,
    		handleClear,
    		dispatch,
    		click_handler
    	];
    }

    class MultiSelection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$8, safe_not_equal, {
    			selectedValue: 0,
    			activeSelectedValue: 1,
    			isDisabled: 2,
    			getSelectionLabel: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MultiSelection",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get selectedValue() {
    		throw new Error("<MultiSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedValue(value) {
    		throw new Error("<MultiSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeSelectedValue() {
    		throw new Error("<MultiSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeSelectedValue(value) {
    		throw new Error("<MultiSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDisabled() {
    		throw new Error("<MultiSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDisabled(value) {
    		throw new Error("<MultiSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getSelectionLabel() {
    		throw new Error("<MultiSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getSelectionLabel(value) {
    		throw new Error("<MultiSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function isOutOfViewport(elem) {
      const bounding = elem.getBoundingClientRect();
      const out = {};

      out.top = bounding.top < 0;
      out.left = bounding.left < 0;
      out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
      out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
      out.any = out.top || out.left || out.bottom || out.right;

      return out;
    }

    function debounce(func, wait, immediate) {
      let timeout;

      return function executedFunction() {
        let context = this;
        let args = arguments;
    	    
        let later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };

        let callNow = immediate && !timeout;
    	
        clearTimeout(timeout);

        timeout = setTimeout(later, wait);
    	
        if (callNow) func.apply(context, args);
      };
    }

    /* node_modules/svelte-select/src/Select.svelte generated by Svelte v3.16.7 */

    const { Object: Object_1$1 } = globals;
    const file$8 = "node_modules/svelte-select/src/Select.svelte";

    // (573:2) {#if isMulti && selectedValue && selectedValue.length > 0}
    function create_if_block_4(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*MultiSelection*/ ctx[6];

    	function switch_props(ctx) {
    		return {
    			props: {
    				selectedValue: /*selectedValue*/ ctx[2],
    				getSelectionLabel: /*getSelectionLabel*/ ctx[11],
    				activeSelectedValue: /*activeSelectedValue*/ ctx[16],
    				isDisabled: /*isDisabled*/ ctx[8]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("multiItemClear", /*handleMultiItemClear*/ ctx[21]);
    		switch_instance.$on("focus", /*handleFocus*/ ctx[24]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*selectedValue*/ 4) switch_instance_changes.selectedValue = /*selectedValue*/ ctx[2];
    			if (dirty[0] & /*getSelectionLabel*/ 2048) switch_instance_changes.getSelectionLabel = /*getSelectionLabel*/ ctx[11];
    			if (dirty[0] & /*activeSelectedValue*/ 65536) switch_instance_changes.activeSelectedValue = /*activeSelectedValue*/ ctx[16];
    			if (dirty[0] & /*isDisabled*/ 256) switch_instance_changes.isDisabled = /*isDisabled*/ ctx[8];

    			if (switch_value !== (switch_value = /*MultiSelection*/ ctx[6])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("multiItemClear", /*handleMultiItemClear*/ ctx[21]);
    					switch_instance.$on("focus", /*handleFocus*/ ctx[24]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(573:2) {#if isMulti && selectedValue && selectedValue.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (595:2) {#if !isMulti && showSelectedItem }
    function create_if_block_3$1(ctx) {
    	let div;
    	let current;
    	let dispose;
    	var switch_value = /*Selection*/ ctx[5];

    	function switch_props(ctx) {
    		return {
    			props: {
    				item: /*selectedValue*/ ctx[2],
    				getSelectionLabel: /*getSelectionLabel*/ ctx[11]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "selectedItem svelte-4y7tu0");
    			add_location(div, file$8, 595, 2, 15514);
    			dispose = listen_dev(div, "focus", /*handleFocus*/ ctx[24], false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*selectedValue*/ 4) switch_instance_changes.item = /*selectedValue*/ ctx[2];
    			if (dirty[0] & /*getSelectionLabel*/ 2048) switch_instance_changes.getSelectionLabel = /*getSelectionLabel*/ ctx[11];

    			if (switch_value !== (switch_value = /*Selection*/ ctx[5])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(595:2) {#if !isMulti && showSelectedItem }",
    		ctx
    	});

    	return block;
    }

    // (601:2) {#if showSelectedItem && isClearable && !isDisabled && !isWaiting}
    function create_if_block_2$1(ctx) {
    	let div;
    	let svg;
    	let path;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124 l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z");
    			add_location(path, file$8, 604, 6, 15917);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "-2 -2 50 50");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "role", "presentation");
    			attr_dev(svg, "class", "svelte-4y7tu0");
    			add_location(svg, file$8, 602, 4, 15809);
    			attr_dev(div, "class", "clearSelect svelte-4y7tu0");
    			add_location(div, file$8, 601, 2, 15739);
    			dispose = listen_dev(div, "click", prevent_default(/*handleClear*/ ctx[15]), false, true, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(601:2) {#if showSelectedItem && isClearable && !isDisabled && !isWaiting}",
    		ctx
    	});

    	return block;
    }

    // (611:2) {#if !isSearchable && !isDisabled && !isWaiting && (showSelectedItem && !isClearable || !showSelectedItem)}
    function create_if_block_1$1(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z");
    			add_location(path, file$8, 613, 6, 16401);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "class", "css-19bqh2r svelte-4y7tu0");
    			add_location(svg, file$8, 612, 4, 16304);
    			attr_dev(div, "class", "indicator svelte-4y7tu0");
    			add_location(div, file$8, 611, 2, 16276);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(611:2) {#if !isSearchable && !isDisabled && !isWaiting && (showSelectedItem && !isClearable || !showSelectedItem)}",
    		ctx
    	});

    	return block;
    }

    // (620:2) {#if isWaiting}
    function create_if_block$2(ctx) {
    	let div;
    	let svg;
    	let circle;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "spinner_path svelte-4y7tu0");
    			attr_dev(circle, "cx", "50");
    			attr_dev(circle, "cy", "50");
    			attr_dev(circle, "r", "20");
    			attr_dev(circle, "fill", "none");
    			attr_dev(circle, "stroke", "currentColor");
    			attr_dev(circle, "stroke-width", "5");
    			attr_dev(circle, "stroke-miterlimit", "10");
    			add_location(circle, file$8, 622, 6, 16835);
    			attr_dev(svg, "class", "spinner_icon svelte-4y7tu0");
    			attr_dev(svg, "viewBox", "25 25 50 50");
    			add_location(svg, file$8, 621, 4, 16780);
    			attr_dev(div, "class", "spinner svelte-4y7tu0");
    			add_location(div, file$8, 620, 2, 16754);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, circle);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(620:2) {#if isWaiting}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let t0;
    	let input_1;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let div_class_value;
    	let current;
    	let dispose;
    	let if_block0 = /*isMulti*/ ctx[7] && /*selectedValue*/ ctx[2] && /*selectedValue*/ ctx[2].length > 0 && create_if_block_4(ctx);

    	let input_1_levels = [
    		/*_inputAttributes*/ ctx[18],
    		{ placeholder: /*placeholderText*/ ctx[20] },
    		{ disabled: /*isDisabled*/ ctx[8] },
    		{ style: /*inputStyles*/ ctx[13] }
    	];

    	let input_1_data = {};

    	for (let i = 0; i < input_1_levels.length; i += 1) {
    		input_1_data = assign(input_1_data, input_1_levels[i]);
    	}

    	let if_block1 = !/*isMulti*/ ctx[7] && /*showSelectedItem*/ ctx[19] && create_if_block_3$1(ctx);
    	let if_block2 = /*showSelectedItem*/ ctx[19] && /*isClearable*/ ctx[14] && !/*isDisabled*/ ctx[8] && !/*isWaiting*/ ctx[4] && create_if_block_2$1(ctx);
    	let if_block3 = !/*isSearchable*/ ctx[12] && !/*isDisabled*/ ctx[8] && !/*isWaiting*/ ctx[4] && (/*showSelectedItem*/ ctx[19] && !/*isClearable*/ ctx[14] || !/*showSelectedItem*/ ctx[19]) && create_if_block_1$1(ctx);
    	let if_block4 = /*isWaiting*/ ctx[4] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			input_1 = element("input");
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			t4 = space();
    			if (if_block4) if_block4.c();
    			set_attributes(input_1, input_1_data);
    			toggle_class(input_1, "svelte-4y7tu0", true);
    			add_location(input_1, file$8, 584, 2, 15261);
    			attr_dev(div, "class", div_class_value = "" + (/*containerClasses*/ ctx[17] + " " + (/*hasError*/ ctx[9] ? "hasError" : "") + " svelte-4y7tu0"));
    			attr_dev(div, "style", /*containerStyles*/ ctx[10]);
    			add_location(div, file$8, 569, 0, 14835);

    			dispose = [
    				listen_dev(window, "click", /*handleWindowClick*/ ctx[25], false, false, false),
    				listen_dev(window, "keydown", /*handleKeyDown*/ ctx[23], false, false, false),
    				listen_dev(window, "resize", /*getPosition*/ ctx[22], false, false, false),
    				listen_dev(input_1, "focus", /*handleFocus*/ ctx[24], false, false, false),
    				listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[68]),
    				listen_dev(div, "click", /*handleClick*/ ctx[26], false, false, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, input_1);
    			/*input_1_binding*/ ctx[67](input_1);
    			set_input_value(input_1, /*filterText*/ ctx[3]);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t2);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t3);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t4);
    			if (if_block4) if_block4.m(div, null);
    			/*div_binding*/ ctx[69](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*isMulti*/ ctx[7] && /*selectedValue*/ ctx[2] && /*selectedValue*/ ctx[2].length > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			set_attributes(input_1, get_spread_update(input_1_levels, [
    				dirty[0] & /*_inputAttributes*/ 262144 && /*_inputAttributes*/ ctx[18],
    				dirty[0] & /*placeholderText*/ 1048576 && ({ placeholder: /*placeholderText*/ ctx[20] }),
    				dirty[0] & /*isDisabled*/ 256 && ({ disabled: /*isDisabled*/ ctx[8] }),
    				dirty[0] & /*inputStyles*/ 8192 && ({ style: /*inputStyles*/ ctx[13] })
    			]));

    			if (dirty[0] & /*filterText*/ 8 && input_1.value !== /*filterText*/ ctx[3]) {
    				set_input_value(input_1, /*filterText*/ ctx[3]);
    			}

    			toggle_class(input_1, "svelte-4y7tu0", true);

    			if (!/*isMulti*/ ctx[7] && /*showSelectedItem*/ ctx[19]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block_3$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*showSelectedItem*/ ctx[19] && /*isClearable*/ ctx[14] && !/*isDisabled*/ ctx[8] && !/*isWaiting*/ ctx[4]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2$1(ctx);
    					if_block2.c();
    					if_block2.m(div, t3);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (!/*isSearchable*/ ctx[12] && !/*isDisabled*/ ctx[8] && !/*isWaiting*/ ctx[4] && (/*showSelectedItem*/ ctx[19] && !/*isClearable*/ ctx[14] || !/*showSelectedItem*/ ctx[19])) {
    				if (!if_block3) {
    					if_block3 = create_if_block_1$1(ctx);
    					if_block3.c();
    					if_block3.m(div, t4);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*isWaiting*/ ctx[4]) {
    				if (!if_block4) {
    					if_block4 = create_if_block$2(ctx);
    					if_block4.c();
    					if_block4.m(div, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (!current || dirty[0] & /*containerClasses, hasError*/ 131584 && div_class_value !== (div_class_value = "" + (/*containerClasses*/ ctx[17] + " " + (/*hasError*/ ctx[9] ? "hasError" : "") + " svelte-4y7tu0"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty[0] & /*containerStyles*/ 1024) {
    				attr_dev(div, "style", /*containerStyles*/ ctx[10]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			/*input_1_binding*/ ctx[67](null);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			/*div_binding*/ ctx[69](null);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { container = undefined } = $$props;
    	let { input = undefined } = $$props;
    	let { Item: Item$1 = Item } = $$props;
    	let { Selection: Selection$1 = Selection } = $$props;
    	let { MultiSelection: MultiSelection$1 = MultiSelection } = $$props;
    	let { isMulti = false } = $$props;
    	let { isDisabled = false } = $$props;
    	let { isCreatable = false } = $$props;
    	let { isFocused = false } = $$props;
    	let { selectedValue = undefined } = $$props;
    	let { filterText = "" } = $$props;
    	let { placeholder = "Select..." } = $$props;
    	let { items = [] } = $$props;
    	let { itemFilter = (label, filterText, option) => label.toLowerCase().includes(filterText.toLowerCase()) } = $$props;
    	let { groupBy = undefined } = $$props;
    	let { groupFilter = groups => groups } = $$props;
    	let { isGroupHeaderSelectable = false } = $$props;

    	let { getGroupHeaderLabel = option => {
    		return option.label;
    	} } = $$props;

    	let { getOptionLabel = (option, filterText) => {
    		return option.isCreator
    		? `Create \"${filterText}\"`
    		: option.label;
    	} } = $$props;

    	let { optionIdentifier = "value" } = $$props;
    	let { loadOptions = undefined } = $$props;
    	let { hasError = false } = $$props;
    	let { containerStyles = "" } = $$props;

    	let { getSelectionLabel = option => {
    		if (option) return option.label;
    	} } = $$props;

    	let { createGroupHeaderItem = groupValue => {
    		return { value: groupValue, label: groupValue };
    	} } = $$props;

    	let { createItem = filterText => {
    		return { value: filterText, label: filterText };
    	} } = $$props;

    	let { isSearchable = true } = $$props;
    	let { inputStyles = "" } = $$props;
    	let { isClearable = true } = $$props;
    	let { isWaiting = false } = $$props;
    	let { listPlacement = "auto" } = $$props;
    	let { listOpen = false } = $$props;
    	let { list = undefined } = $$props;
    	let { isVirtualList = false } = $$props;
    	let { loadOptionsInterval = 300 } = $$props;
    	let { noOptionsMessage = "No options" } = $$props;
    	let { hideEmptyState = false } = $$props;
    	let { filteredItems = [] } = $$props;
    	let { inputAttributes = {} } = $$props;
    	let { listAutoWidth = true } = $$props;
    	let target;
    	let activeSelectedValue;
    	let _items = [];
    	let originalItemsClone;
    	let containerClasses = "";
    	let prev_selectedValue;
    	let prev_listOpen;
    	let prev_filterText;
    	let prev_isFocused;
    	let prev_filteredItems;

    	async function resetFilter() {
    		await tick();
    		$$invalidate(3, filterText = "");
    	}

    	const getItems = debounce(
    		async () => {
    			$$invalidate(4, isWaiting = true);
    			$$invalidate(28, items = await loadOptions(filterText));
    			$$invalidate(4, isWaiting = false);
    			$$invalidate(27, isFocused = true);
    			$$invalidate(29, listOpen = true);
    		},
    		loadOptionsInterval
    	);

    	let _inputAttributes = {};

    	beforeUpdate(() => {
    		if (isMulti && selectedValue && selectedValue.length > 1) {
    			checkSelectedValueForDuplicates();
    		}

    		if (!isMulti && selectedValue && prev_selectedValue !== selectedValue) {
    			if (!prev_selectedValue || JSON.stringify(selectedValue[optionIdentifier]) !== JSON.stringify(prev_selectedValue[optionIdentifier])) {
    				dispatch("select", selectedValue);
    			}
    		}

    		if (isMulti && JSON.stringify(selectedValue) !== JSON.stringify(prev_selectedValue)) {
    			if (checkSelectedValueForDuplicates()) {
    				dispatch("select", selectedValue);
    			}
    		}

    		if (container && listOpen !== prev_listOpen) {
    			if (listOpen) {
    				loadList();
    			} else {
    				removeList();
    			}
    		}

    		if (filterText !== prev_filterText) {
    			if (filterText.length > 0) {
    				$$invalidate(27, isFocused = true);
    				$$invalidate(29, listOpen = true);

    				if (loadOptions) {
    					getItems();
    				} else {
    					loadList();
    					$$invalidate(29, listOpen = true);

    					if (isMulti) {
    						$$invalidate(16, activeSelectedValue = undefined);
    					}
    				}
    			} else {
    				setList([]);
    			}

    			if (list) {
    				list.$set({ filterText });
    			}
    		}

    		if (isFocused !== prev_isFocused) {
    			if (isFocused || listOpen) {
    				handleFocus();
    			} else {
    				resetFilter();
    				if (input) input.blur();
    			}
    		}

    		if (prev_filteredItems !== filteredItems) {
    			let _filteredItems = [...filteredItems];

    			if (isCreatable && filterText) {
    				const itemToCreate = {
    					...createItem(filterText),
    					isCreator: true
    				};

    				const existingItemWithFilterValue = _filteredItems.find(item => {
    					return item[optionIdentifier] === itemToCreate[optionIdentifier];
    				});

    				let existingSelectionWithFilterValue;

    				if (selectedValue) {
    					if (isMulti) {
    						existingSelectionWithFilterValue = selectedValue.find(selection => {
    							return selection[optionIdentifier] === itemToCreate[optionIdentifier];
    						});
    					} else if (selectedValue[optionIdentifier] === itemToCreate[optionIdentifier]) {
    						existingSelectionWithFilterValue = selectedValue;
    					}
    				}

    				if (!existingItemWithFilterValue && !existingSelectionWithFilterValue) {
    					_filteredItems = [..._filteredItems, itemToCreate];
    				}
    			}

    			setList(_filteredItems);
    		}

    		prev_selectedValue = selectedValue;
    		prev_listOpen = listOpen;
    		prev_filterText = filterText;
    		prev_isFocused = isFocused;
    		prev_filteredItems = filteredItems;
    	});

    	function checkSelectedValueForDuplicates() {
    		let noDuplicates = true;

    		if (selectedValue) {
    			const ids = [];
    			const uniqueValues = [];

    			selectedValue.forEach(val => {
    				if (!ids.includes(val[optionIdentifier])) {
    					ids.push(val[optionIdentifier]);
    					uniqueValues.push(val);
    				} else {
    					noDuplicates = false;
    				}
    			});

    			$$invalidate(2, selectedValue = uniqueValues);
    		}

    		return noDuplicates;
    	}

    	async function setList(items) {
    		await tick();
    		if (list) return list.$set({ items });
    		if (loadOptions && items.length > 0) loadList();
    	}

    	function handleMultiItemClear(event) {
    		const { detail } = event;
    		const itemToRemove = selectedValue[detail ? detail.i : selectedValue.length - 1];

    		if (selectedValue.length === 1) {
    			$$invalidate(2, selectedValue = undefined);
    		} else {
    			$$invalidate(2, selectedValue = selectedValue.filter(item => {
    				return item !== itemToRemove;
    			}));
    		}

    		dispatch("clear", itemToRemove);
    		getPosition();
    	}

    	async function getPosition() {
    		await tick();
    		if (!target || !container) return;
    		const { top, height, width } = container.getBoundingClientRect();
    		target.style["min-width"] = `${width}px`;
    		target.style.width = `${listAutoWidth ? "auto" : "100%"}`;
    		target.style.left = "0";

    		if (listPlacement === "top") {
    			target.style.bottom = `${height + 5}px`;
    		} else {
    			target.style.top = `${height + 5}px`;
    		}

    		target = target;

    		if (listPlacement === "auto" && isOutOfViewport(target).bottom) {
    			target.style.top = ``;
    			target.style.bottom = `${height + 5}px`;
    		}

    		target.style.visibility = "";
    	}

    	function handleKeyDown(e) {
    		if (!isFocused) return;

    		switch (e.key) {
    			case "ArrowDown":
    				e.preventDefault();
    				$$invalidate(29, listOpen = true);
    				$$invalidate(16, activeSelectedValue = undefined);
    				break;
    			case "ArrowUp":
    				e.preventDefault();
    				$$invalidate(29, listOpen = true);
    				$$invalidate(16, activeSelectedValue = undefined);
    				break;
    			case "Tab":
    				if (!listOpen) $$invalidate(27, isFocused = false);
    				break;
    			case "Backspace":
    				if (!isMulti || filterText.length > 0) return;
    				if (isMulti && selectedValue && selectedValue.length > 0) {
    					handleMultiItemClear(activeSelectedValue !== undefined
    					? activeSelectedValue
    					: selectedValue.length - 1);

    					if (activeSelectedValue === 0 || activeSelectedValue === undefined) break;

    					$$invalidate(16, activeSelectedValue = selectedValue.length > activeSelectedValue
    					? activeSelectedValue - 1
    					: undefined);
    				}
    				break;
    			case "ArrowLeft":
    				if (list) list.$set({ hoverItemIndex: -1 });
    				if (!isMulti || filterText.length > 0) return;
    				if (activeSelectedValue === undefined) {
    					$$invalidate(16, activeSelectedValue = selectedValue.length - 1);
    				} else if (selectedValue.length > activeSelectedValue && activeSelectedValue !== 0) {
    					$$invalidate(16, activeSelectedValue -= 1);
    				}
    				break;
    			case "ArrowRight":
    				if (list) list.$set({ hoverItemIndex: -1 });
    				if (!isMulti || filterText.length > 0 || activeSelectedValue === undefined) return;
    				if (activeSelectedValue === selectedValue.length - 1) {
    					$$invalidate(16, activeSelectedValue = undefined);
    				} else if (activeSelectedValue < selectedValue.length - 1) {
    					$$invalidate(16, activeSelectedValue += 1);
    				}
    				break;
    		}
    	}

    	function handleFocus() {
    		$$invalidate(27, isFocused = true);
    		if (input) input.focus();
    	}

    	function removeList() {
    		resetFilter();
    		$$invalidate(16, activeSelectedValue = undefined);
    		if (!list) return;
    		list.$destroy();
    		$$invalidate(30, list = undefined);
    		if (!target) return;
    		if (target.parentNode) target.parentNode.removeChild(target);
    		target = undefined;
    		$$invalidate(30, list);
    		target = target;
    	}

    	function handleWindowClick(event) {
    		if (!container) return;
    		if (container.contains(event.target)) return;
    		$$invalidate(27, isFocused = false);
    		$$invalidate(29, listOpen = false);
    		$$invalidate(16, activeSelectedValue = undefined);
    		if (input) input.blur();
    	}

    	function handleClick() {
    		if (isDisabled) return;
    		$$invalidate(27, isFocused = true);
    		$$invalidate(29, listOpen = !listOpen);
    	}

    	function handleClear() {
    		$$invalidate(2, selectedValue = undefined);
    		$$invalidate(29, listOpen = false);
    		dispatch("clear", selectedValue);
    		handleFocus();
    	}

    	async function loadList() {
    		await tick();
    		if (target && list) return;

    		const data = {
    			Item: Item$1,
    			filterText,
    			optionIdentifier,
    			noOptionsMessage,
    			hideEmptyState,
    			isVirtualList,
    			selectedValue,
    			isMulti,
    			getGroupHeaderLabel,
    			items: filteredItems
    		};

    		if (getOptionLabel) {
    			data.getOptionLabel = getOptionLabel;
    		}

    		target = document.createElement("div");

    		Object.assign(target.style, {
    			position: "absolute",
    			"z-index": 2,
    			"visibility": "hidden"
    		});

    		$$invalidate(30, list);
    		target = target;
    		if (container) container.appendChild(target);
    		$$invalidate(30, list = new List({ target, props: data }));

    		list.$on("itemSelected", event => {
    			const { detail } = event;

    			if (detail) {
    				const item = Object.assign({}, detail);

    				if (isMulti) {
    					$$invalidate(2, selectedValue = selectedValue ? selectedValue.concat([item]) : [item]);
    				} else {
    					$$invalidate(2, selectedValue = item);
    				}

    				resetFilter();
    				($$invalidate(2, selectedValue), $$invalidate(41, optionIdentifier));

    				setTimeout(() => {
    					$$invalidate(29, listOpen = false);
    					$$invalidate(16, activeSelectedValue = undefined);
    				});
    			}
    		});

    		list.$on("itemCreated", event => {
    			const { detail } = event;

    			if (isMulti) {
    				$$invalidate(2, selectedValue = selectedValue || []);
    				$$invalidate(2, selectedValue = [...selectedValue, createItem(detail)]);
    			} else {
    				$$invalidate(2, selectedValue = createItem(detail));
    			}

    			$$invalidate(3, filterText = "");
    			$$invalidate(29, listOpen = false);
    			$$invalidate(16, activeSelectedValue = undefined);
    			resetFilter();
    		});

    		list.$on("closeList", () => {
    			$$invalidate(29, listOpen = false);
    		});

    		($$invalidate(30, list), target = target);
    		getPosition();
    	}

    	onMount(() => {
    		if (isFocused) input.focus();
    		if (listOpen) loadList();

    		if (items && items.length > 0) {
    			$$invalidate(53, originalItemsClone = JSON.stringify(items));
    		}

    		if (selectedValue) {
    			if (isMulti) {
    				$$invalidate(2, selectedValue = selectedValue.map(item => {
    					if (typeof item === "string") {
    						return { value: item, label: item };
    					} else {
    						return item;
    					}
    				}));
    			}
    		}
    	});

    	onDestroy(() => {
    		removeList();
    	});

    	const writable_props = [
    		"container",
    		"input",
    		"Item",
    		"Selection",
    		"MultiSelection",
    		"isMulti",
    		"isDisabled",
    		"isCreatable",
    		"isFocused",
    		"selectedValue",
    		"filterText",
    		"placeholder",
    		"items",
    		"itemFilter",
    		"groupBy",
    		"groupFilter",
    		"isGroupHeaderSelectable",
    		"getGroupHeaderLabel",
    		"getOptionLabel",
    		"optionIdentifier",
    		"loadOptions",
    		"hasError",
    		"containerStyles",
    		"getSelectionLabel",
    		"createGroupHeaderItem",
    		"createItem",
    		"isSearchable",
    		"inputStyles",
    		"isClearable",
    		"isWaiting",
    		"listPlacement",
    		"listOpen",
    		"list",
    		"isVirtualList",
    		"loadOptionsInterval",
    		"noOptionsMessage",
    		"hideEmptyState",
    		"filteredItems",
    		"inputAttributes",
    		"listAutoWidth"
    	];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Select> was created with unknown prop '${key}'`);
    	});

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(1, input = $$value);
    		});
    	}

    	function input_1_input_handler() {
    		filterText = this.value;
    		$$invalidate(3, filterText);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(0, container = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("container" in $$props) $$invalidate(0, container = $$props.container);
    		if ("input" in $$props) $$invalidate(1, input = $$props.input);
    		if ("Item" in $$props) $$invalidate(32, Item$1 = $$props.Item);
    		if ("Selection" in $$props) $$invalidate(5, Selection$1 = $$props.Selection);
    		if ("MultiSelection" in $$props) $$invalidate(6, MultiSelection$1 = $$props.MultiSelection);
    		if ("isMulti" in $$props) $$invalidate(7, isMulti = $$props.isMulti);
    		if ("isDisabled" in $$props) $$invalidate(8, isDisabled = $$props.isDisabled);
    		if ("isCreatable" in $$props) $$invalidate(33, isCreatable = $$props.isCreatable);
    		if ("isFocused" in $$props) $$invalidate(27, isFocused = $$props.isFocused);
    		if ("selectedValue" in $$props) $$invalidate(2, selectedValue = $$props.selectedValue);
    		if ("filterText" in $$props) $$invalidate(3, filterText = $$props.filterText);
    		if ("placeholder" in $$props) $$invalidate(34, placeholder = $$props.placeholder);
    		if ("items" in $$props) $$invalidate(28, items = $$props.items);
    		if ("itemFilter" in $$props) $$invalidate(35, itemFilter = $$props.itemFilter);
    		if ("groupBy" in $$props) $$invalidate(36, groupBy = $$props.groupBy);
    		if ("groupFilter" in $$props) $$invalidate(37, groupFilter = $$props.groupFilter);
    		if ("isGroupHeaderSelectable" in $$props) $$invalidate(38, isGroupHeaderSelectable = $$props.isGroupHeaderSelectable);
    		if ("getGroupHeaderLabel" in $$props) $$invalidate(39, getGroupHeaderLabel = $$props.getGroupHeaderLabel);
    		if ("getOptionLabel" in $$props) $$invalidate(40, getOptionLabel = $$props.getOptionLabel);
    		if ("optionIdentifier" in $$props) $$invalidate(41, optionIdentifier = $$props.optionIdentifier);
    		if ("loadOptions" in $$props) $$invalidate(42, loadOptions = $$props.loadOptions);
    		if ("hasError" in $$props) $$invalidate(9, hasError = $$props.hasError);
    		if ("containerStyles" in $$props) $$invalidate(10, containerStyles = $$props.containerStyles);
    		if ("getSelectionLabel" in $$props) $$invalidate(11, getSelectionLabel = $$props.getSelectionLabel);
    		if ("createGroupHeaderItem" in $$props) $$invalidate(43, createGroupHeaderItem = $$props.createGroupHeaderItem);
    		if ("createItem" in $$props) $$invalidate(44, createItem = $$props.createItem);
    		if ("isSearchable" in $$props) $$invalidate(12, isSearchable = $$props.isSearchable);
    		if ("inputStyles" in $$props) $$invalidate(13, inputStyles = $$props.inputStyles);
    		if ("isClearable" in $$props) $$invalidate(14, isClearable = $$props.isClearable);
    		if ("isWaiting" in $$props) $$invalidate(4, isWaiting = $$props.isWaiting);
    		if ("listPlacement" in $$props) $$invalidate(45, listPlacement = $$props.listPlacement);
    		if ("listOpen" in $$props) $$invalidate(29, listOpen = $$props.listOpen);
    		if ("list" in $$props) $$invalidate(30, list = $$props.list);
    		if ("isVirtualList" in $$props) $$invalidate(46, isVirtualList = $$props.isVirtualList);
    		if ("loadOptionsInterval" in $$props) $$invalidate(47, loadOptionsInterval = $$props.loadOptionsInterval);
    		if ("noOptionsMessage" in $$props) $$invalidate(48, noOptionsMessage = $$props.noOptionsMessage);
    		if ("hideEmptyState" in $$props) $$invalidate(49, hideEmptyState = $$props.hideEmptyState);
    		if ("filteredItems" in $$props) $$invalidate(31, filteredItems = $$props.filteredItems);
    		if ("inputAttributes" in $$props) $$invalidate(50, inputAttributes = $$props.inputAttributes);
    		if ("listAutoWidth" in $$props) $$invalidate(51, listAutoWidth = $$props.listAutoWidth);
    	};

    	$$self.$capture_state = () => {
    		return {
    			container,
    			input,
    			Item: Item$1,
    			Selection: Selection$1,
    			MultiSelection: MultiSelection$1,
    			isMulti,
    			isDisabled,
    			isCreatable,
    			isFocused,
    			selectedValue,
    			filterText,
    			placeholder,
    			items,
    			itemFilter,
    			groupBy,
    			groupFilter,
    			isGroupHeaderSelectable,
    			getGroupHeaderLabel,
    			getOptionLabel,
    			optionIdentifier,
    			loadOptions,
    			hasError,
    			containerStyles,
    			getSelectionLabel,
    			createGroupHeaderItem,
    			createItem,
    			isSearchable,
    			inputStyles,
    			isClearable,
    			isWaiting,
    			listPlacement,
    			listOpen,
    			list,
    			isVirtualList,
    			loadOptionsInterval,
    			noOptionsMessage,
    			hideEmptyState,
    			filteredItems,
    			inputAttributes,
    			listAutoWidth,
    			target,
    			activeSelectedValue,
    			_items,
    			originalItemsClone,
    			containerClasses,
    			prev_selectedValue,
    			prev_listOpen,
    			prev_filterText,
    			prev_isFocused,
    			prev_filteredItems,
    			_inputAttributes,
    			showSelectedItem,
    			placeholderText
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("container" in $$props) $$invalidate(0, container = $$props.container);
    		if ("input" in $$props) $$invalidate(1, input = $$props.input);
    		if ("Item" in $$props) $$invalidate(32, Item$1 = $$props.Item);
    		if ("Selection" in $$props) $$invalidate(5, Selection$1 = $$props.Selection);
    		if ("MultiSelection" in $$props) $$invalidate(6, MultiSelection$1 = $$props.MultiSelection);
    		if ("isMulti" in $$props) $$invalidate(7, isMulti = $$props.isMulti);
    		if ("isDisabled" in $$props) $$invalidate(8, isDisabled = $$props.isDisabled);
    		if ("isCreatable" in $$props) $$invalidate(33, isCreatable = $$props.isCreatable);
    		if ("isFocused" in $$props) $$invalidate(27, isFocused = $$props.isFocused);
    		if ("selectedValue" in $$props) $$invalidate(2, selectedValue = $$props.selectedValue);
    		if ("filterText" in $$props) $$invalidate(3, filterText = $$props.filterText);
    		if ("placeholder" in $$props) $$invalidate(34, placeholder = $$props.placeholder);
    		if ("items" in $$props) $$invalidate(28, items = $$props.items);
    		if ("itemFilter" in $$props) $$invalidate(35, itemFilter = $$props.itemFilter);
    		if ("groupBy" in $$props) $$invalidate(36, groupBy = $$props.groupBy);
    		if ("groupFilter" in $$props) $$invalidate(37, groupFilter = $$props.groupFilter);
    		if ("isGroupHeaderSelectable" in $$props) $$invalidate(38, isGroupHeaderSelectable = $$props.isGroupHeaderSelectable);
    		if ("getGroupHeaderLabel" in $$props) $$invalidate(39, getGroupHeaderLabel = $$props.getGroupHeaderLabel);
    		if ("getOptionLabel" in $$props) $$invalidate(40, getOptionLabel = $$props.getOptionLabel);
    		if ("optionIdentifier" in $$props) $$invalidate(41, optionIdentifier = $$props.optionIdentifier);
    		if ("loadOptions" in $$props) $$invalidate(42, loadOptions = $$props.loadOptions);
    		if ("hasError" in $$props) $$invalidate(9, hasError = $$props.hasError);
    		if ("containerStyles" in $$props) $$invalidate(10, containerStyles = $$props.containerStyles);
    		if ("getSelectionLabel" in $$props) $$invalidate(11, getSelectionLabel = $$props.getSelectionLabel);
    		if ("createGroupHeaderItem" in $$props) $$invalidate(43, createGroupHeaderItem = $$props.createGroupHeaderItem);
    		if ("createItem" in $$props) $$invalidate(44, createItem = $$props.createItem);
    		if ("isSearchable" in $$props) $$invalidate(12, isSearchable = $$props.isSearchable);
    		if ("inputStyles" in $$props) $$invalidate(13, inputStyles = $$props.inputStyles);
    		if ("isClearable" in $$props) $$invalidate(14, isClearable = $$props.isClearable);
    		if ("isWaiting" in $$props) $$invalidate(4, isWaiting = $$props.isWaiting);
    		if ("listPlacement" in $$props) $$invalidate(45, listPlacement = $$props.listPlacement);
    		if ("listOpen" in $$props) $$invalidate(29, listOpen = $$props.listOpen);
    		if ("list" in $$props) $$invalidate(30, list = $$props.list);
    		if ("isVirtualList" in $$props) $$invalidate(46, isVirtualList = $$props.isVirtualList);
    		if ("loadOptionsInterval" in $$props) $$invalidate(47, loadOptionsInterval = $$props.loadOptionsInterval);
    		if ("noOptionsMessage" in $$props) $$invalidate(48, noOptionsMessage = $$props.noOptionsMessage);
    		if ("hideEmptyState" in $$props) $$invalidate(49, hideEmptyState = $$props.hideEmptyState);
    		if ("filteredItems" in $$props) $$invalidate(31, filteredItems = $$props.filteredItems);
    		if ("inputAttributes" in $$props) $$invalidate(50, inputAttributes = $$props.inputAttributes);
    		if ("listAutoWidth" in $$props) $$invalidate(51, listAutoWidth = $$props.listAutoWidth);
    		if ("target" in $$props) target = $$props.target;
    		if ("activeSelectedValue" in $$props) $$invalidate(16, activeSelectedValue = $$props.activeSelectedValue);
    		if ("_items" in $$props) $$invalidate(60, _items = $$props._items);
    		if ("originalItemsClone" in $$props) $$invalidate(53, originalItemsClone = $$props.originalItemsClone);
    		if ("containerClasses" in $$props) $$invalidate(17, containerClasses = $$props.containerClasses);
    		if ("prev_selectedValue" in $$props) prev_selectedValue = $$props.prev_selectedValue;
    		if ("prev_listOpen" in $$props) prev_listOpen = $$props.prev_listOpen;
    		if ("prev_filterText" in $$props) prev_filterText = $$props.prev_filterText;
    		if ("prev_isFocused" in $$props) prev_isFocused = $$props.prev_isFocused;
    		if ("prev_filteredItems" in $$props) prev_filteredItems = $$props.prev_filteredItems;
    		if ("_inputAttributes" in $$props) $$invalidate(18, _inputAttributes = $$props._inputAttributes);
    		if ("showSelectedItem" in $$props) $$invalidate(19, showSelectedItem = $$props.showSelectedItem);
    		if ("placeholderText" in $$props) $$invalidate(20, placeholderText = $$props.placeholderText);
    	};

    	let showSelectedItem;
    	let placeholderText;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*containerClasses, isMulti, isDisabled, isFocused*/ 134349184) {
    			 {
    				$$invalidate(17, containerClasses = `selectContainer`);
    				$$invalidate(17, containerClasses += isMulti ? " multiSelect" : "");
    				$$invalidate(17, containerClasses += isDisabled ? " disabled" : "");
    				$$invalidate(17, containerClasses += isFocused ? " focused" : "");
    			}
    		}

    		if ($$self.$$.dirty[0] & /*selectedValue*/ 4 | $$self.$$.dirty[1] & /*optionIdentifier*/ 1024) {
    			 {
    				if (typeof selectedValue === "string") {
    					$$invalidate(2, selectedValue = {
    						[optionIdentifier]: selectedValue,
    						label: selectedValue
    					});
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*selectedValue, filterText*/ 12) {
    			 $$invalidate(19, showSelectedItem = selectedValue && filterText.length === 0);
    		}

    		if ($$self.$$.dirty[0] & /*selectedValue*/ 4 | $$self.$$.dirty[1] & /*placeholder*/ 8) {
    			 $$invalidate(20, placeholderText = selectedValue ? "" : placeholder);
    		}

    		if ($$self.$$.dirty[0] & /*isSearchable*/ 4096 | $$self.$$.dirty[1] & /*inputAttributes*/ 524288) {
    			 {
    				$$invalidate(18, _inputAttributes = Object.assign(inputAttributes, {
    					autocomplete: "off",
    					autocorrect: "off",
    					spellcheck: false
    				}));

    				if (!isSearchable) {
    					$$invalidate(18, _inputAttributes.readonly = true, _inputAttributes);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*items, filterText, isMulti, selectedValue*/ 268435596 | $$self.$$.dirty[1] & /*loadOptions, originalItemsClone, optionIdentifier, itemFilter, getOptionLabel, groupBy, createGroupHeaderItem, isGroupHeaderSelectable, groupFilter*/ 4202224) {
    			 {
    				let _filteredItems;
    				let _items = items;

    				if (items && items.length > 0 && typeof items[0] !== "object") {
    					_items = items.map((item, index) => {
    						return { index, value: item, label: item };
    					});
    				}

    				if (loadOptions && filterText.length === 0 && originalItemsClone) {
    					_filteredItems = JSON.parse(originalItemsClone);
    					_items = JSON.parse(originalItemsClone);
    				} else {
    					_filteredItems = loadOptions
    					? filterText.length === 0 ? [] : _items
    					: _items.filter(item => {
    							let keepItem = true;

    							if (isMulti && selectedValue) {
    								keepItem = !selectedValue.find(value => {
    									return value[optionIdentifier] === item[optionIdentifier];
    								});
    							}

    							if (!keepItem) return false;
    							if (filterText.length < 1) return true;
    							return itemFilter(getOptionLabel(item, filterText), filterText, item);
    						});
    				}

    				if (groupBy) {
    					const groupValues = [];
    					const groups = {};

    					_filteredItems.forEach(item => {
    						const groupValue = groupBy(item);

    						if (!groupValues.includes(groupValue)) {
    							groupValues.push(groupValue);
    							groups[groupValue] = [];

    							if (groupValue) {
    								groups[groupValue].push(Object.assign(createGroupHeaderItem(groupValue, item), {
    									id: groupValue,
    									isGroupHeader: true,
    									isSelectable: isGroupHeaderSelectable
    								}));
    							}
    						}

    						groups[groupValue].push(Object.assign({ isGroupItem: !!groupValue }, item));
    					});

    					const sortedGroupedItems = [];

    					groupFilter(groupValues).forEach(groupValue => {
    						sortedGroupedItems.push(...groups[groupValue]);
    					});

    					$$invalidate(31, filteredItems = sortedGroupedItems);
    				} else {
    					$$invalidate(31, filteredItems = _filteredItems);
    				}
    			}
    		}
    	};

    	return [
    		container,
    		input,
    		selectedValue,
    		filterText,
    		isWaiting,
    		Selection$1,
    		MultiSelection$1,
    		isMulti,
    		isDisabled,
    		hasError,
    		containerStyles,
    		getSelectionLabel,
    		isSearchable,
    		inputStyles,
    		isClearable,
    		handleClear,
    		activeSelectedValue,
    		containerClasses,
    		_inputAttributes,
    		showSelectedItem,
    		placeholderText,
    		handleMultiItemClear,
    		getPosition,
    		handleKeyDown,
    		handleFocus,
    		handleWindowClick,
    		handleClick,
    		isFocused,
    		items,
    		listOpen,
    		list,
    		filteredItems,
    		Item$1,
    		isCreatable,
    		placeholder,
    		itemFilter,
    		groupBy,
    		groupFilter,
    		isGroupHeaderSelectable,
    		getGroupHeaderLabel,
    		getOptionLabel,
    		optionIdentifier,
    		loadOptions,
    		createGroupHeaderItem,
    		createItem,
    		listPlacement,
    		isVirtualList,
    		loadOptionsInterval,
    		noOptionsMessage,
    		hideEmptyState,
    		inputAttributes,
    		listAutoWidth,
    		target,
    		originalItemsClone,
    		prev_selectedValue,
    		prev_listOpen,
    		prev_filterText,
    		prev_isFocused,
    		prev_filteredItems,
    		dispatch,
    		_items,
    		resetFilter,
    		getItems,
    		checkSelectedValueForDuplicates,
    		setList,
    		removeList,
    		loadList,
    		input_1_binding,
    		input_1_input_handler,
    		div_binding
    	];
    }

    class Select extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$8,
    			create_fragment$9,
    			safe_not_equal,
    			{
    				container: 0,
    				input: 1,
    				Item: 32,
    				Selection: 5,
    				MultiSelection: 6,
    				isMulti: 7,
    				isDisabled: 8,
    				isCreatable: 33,
    				isFocused: 27,
    				selectedValue: 2,
    				filterText: 3,
    				placeholder: 34,
    				items: 28,
    				itemFilter: 35,
    				groupBy: 36,
    				groupFilter: 37,
    				isGroupHeaderSelectable: 38,
    				getGroupHeaderLabel: 39,
    				getOptionLabel: 40,
    				optionIdentifier: 41,
    				loadOptions: 42,
    				hasError: 9,
    				containerStyles: 10,
    				getSelectionLabel: 11,
    				createGroupHeaderItem: 43,
    				createItem: 44,
    				isSearchable: 12,
    				inputStyles: 13,
    				isClearable: 14,
    				isWaiting: 4,
    				listPlacement: 45,
    				listOpen: 29,
    				list: 30,
    				isVirtualList: 46,
    				loadOptionsInterval: 47,
    				noOptionsMessage: 48,
    				hideEmptyState: 49,
    				filteredItems: 31,
    				inputAttributes: 50,
    				listAutoWidth: 51,
    				handleClear: 15
    			},
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Select",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get container() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Item() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Item(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Selection() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Selection(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get MultiSelection() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set MultiSelection(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isMulti() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isMulti(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDisabled() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDisabled(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCreatable() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCreatable(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFocused() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFocused(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedValue() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedValue(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterText() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterText(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemFilter() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemFilter(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get groupBy() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set groupBy(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get groupFilter() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set groupFilter(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isGroupHeaderSelectable() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isGroupHeaderSelectable(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getGroupHeaderLabel() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getGroupHeaderLabel(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getOptionLabel() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getOptionLabel(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get optionIdentifier() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set optionIdentifier(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loadOptions() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loadOptions(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasError() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasError(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerStyles() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerStyles(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getSelectionLabel() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getSelectionLabel(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get createGroupHeaderItem() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set createGroupHeaderItem(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get createItem() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set createItem(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSearchable() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSearchable(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputStyles() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputStyles(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isClearable() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isClearable(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isWaiting() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isWaiting(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listPlacement() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listPlacement(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listOpen() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listOpen(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get list() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isVirtualList() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isVirtualList(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loadOptionsInterval() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loadOptionsInterval(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noOptionsMessage() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noOptionsMessage(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideEmptyState() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideEmptyState(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filteredItems() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filteredItems(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputAttributes() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputAttributes(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listAutoWidth() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listAutoWidth(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleClear() {
    		return this.$$.ctx[15];
    	}

    	set handleClear(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/comp/FlightRoutePicker.svelte generated by Svelte v3.16.7 */
    const file$9 = "src/comp/FlightRoutePicker.svelte";

    // (131:4) {#if type === 'roundtrip'}
    function create_if_block$3(ctx) {
    	let label;
    	let t;
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t = text("Return:\n        ");
    			input = element("input");
    			attr_dev(input, "min", /*depart_date*/ ctx[3]);
    			attr_dev(input, "type", "date");
    			add_location(input, file$9, 133, 8, 3464);
    			add_location(label, file$9, 131, 6, 3432);
    			dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[22]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t);
    			append_dev(label, input);
    			set_input_value(input, /*return_date*/ ctx[4]);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*depart_date*/ 8) {
    				attr_dev(input, "min", /*depart_date*/ ctx[3]);
    			}

    			if (dirty & /*return_date*/ 16) {
    				set_input_value(input, /*return_date*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(131:4) {#if type === 'roundtrip'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div8;
    	let div0;
    	let label0;
    	let t0;
    	let input0;
    	let t1;
    	let label1;
    	let t2;
    	let input1;
    	let t3;
    	let div1;
    	let label2;
    	let t4;
    	let updating_selectedValue;
    	let t5;
    	let div2;
    	let label3;
    	let t6;
    	let updating_selectedValue_1;
    	let t7;
    	let div3;
    	let label4;
    	let t8;
    	let input2;
    	let t9;
    	let t10;
    	let div4;
    	let t11;
    	let input3;
    	let input3_value_value;
    	let input3_updating = false;
    	let t12;
    	let div5;
    	let t13;
    	let input4;
    	let input4_value_value;
    	let input4_updating = false;
    	let t14;
    	let div6;
    	let t15;
    	let updating_selectedValue_2;
    	let t16;
    	let input5;
    	let t17;
    	let div7;
    	let button;
    	let current;
    	let dispose;

    	function select0_selectedValue_binding(value) {
    		/*select0_selectedValue_binding*/ ctx[19].call(null, value);
    	}

    	let select0_props = {
    		loadOptions: /*findAirports*/ ctx[10],
    		optionIdentifier: "id",
    		getSelectionLabel: func,
    		getOptionLabel: func_1,
    		placeholder: "Search airports"
    	};

    	if (/*from_airport*/ ctx[1] !== void 0) {
    		select0_props.selectedValue = /*from_airport*/ ctx[1];
    	}

    	const select0 = new Select({ props: select0_props, $$inline: true });
    	binding_callbacks.push(() => bind(select0, "selectedValue", select0_selectedValue_binding));

    	function select1_selectedValue_binding(value_1) {
    		/*select1_selectedValue_binding*/ ctx[20].call(null, value_1);
    	}

    	let select1_props = {
    		loadOptions: /*findAirports*/ ctx[10],
    		optionIdentifier: "id",
    		getSelectionLabel: func_2,
    		getOptionLabel: func_3,
    		placeholder: "Search airports"
    	};

    	if (/*to_airport*/ ctx[2] !== void 0) {
    		select1_props.selectedValue = /*to_airport*/ ctx[2];
    	}

    	const select1 = new Select({ props: select1_props, $$inline: true });
    	binding_callbacks.push(() => bind(select1, "selectedValue", select1_selectedValue_binding));
    	let if_block = /*type*/ ctx[0] === "roundtrip" && create_if_block$3(ctx);

    	function input3_input_handler() {
    		input3_updating = true;
    		/*input3_input_handler*/ ctx[23].call(input3);
    	}

    	function input4_input_handler() {
    		input4_updating = true;
    		/*input4_input_handler*/ ctx[24].call(input4);
    	}

    	function select2_selectedValue_binding(value_2) {
    		/*select2_selectedValue_binding*/ ctx[25].call(null, value_2);
    	}

    	let select2_props = {
    		loadOptions: /*findAirlines*/ ctx[11],
    		optionIdentifier: "id",
    		getSelectionLabel: func_4,
    		getOptionLabel: func_5,
    		placeholder: "Search airlines"
    	};

    	if (/*filter_restricted_airline*/ ctx[8] !== void 0) {
    		select2_props.selectedValue = /*filter_restricted_airline*/ ctx[8];
    	}

    	const select2 = new Select({ props: select2_props, $$inline: true });
    	binding_callbacks.push(() => bind(select2, "selectedValue", select2_selectedValue_binding));

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			t0 = text("One way:\n      ");
    			input0 = element("input");
    			t1 = space();
    			label1 = element("label");
    			t2 = text("Roundtrip:\n      ");
    			input1 = element("input");
    			t3 = space();
    			div1 = element("div");
    			label2 = element("label");
    			t4 = text("From:\n      ");
    			create_component(select0.$$.fragment);
    			t5 = space();
    			div2 = element("div");
    			label3 = element("label");
    			t6 = text("To:\n      ");
    			create_component(select1.$$.fragment);
    			t7 = space();
    			div3 = element("div");
    			label4 = element("label");
    			t8 = text("Depart:\n      ");
    			input2 = element("input");
    			t9 = space();
    			if (if_block) if_block.c();
    			t10 = space();
    			div4 = element("div");
    			t11 = text("Max stops:\n    ");
    			input3 = element("input");
    			t12 = space();
    			div5 = element("div");
    			t13 = text("Max duration (minutes):\n    ");
    			input4 = element("input");
    			t14 = space();
    			div6 = element("div");
    			t15 = text("Restrict airline:\n    ");
    			create_component(select2.$$.fragment);
    			t16 = space();
    			input5 = element("input");
    			t17 = space();
    			div7 = element("div");
    			button = element("button");
    			button.textContent = "Find flights";
    			attr_dev(input0, "type", "radio");
    			input0.__value = "one-way";
    			input0.value = input0.__value;
    			/*$$binding_groups*/ ctx[17][0].push(input0);
    			add_location(input0, file$9, 91, 6, 2340);
    			add_location(label0, file$9, 89, 4, 2311);
    			attr_dev(input1, "type", "radio");
    			input1.__value = "roundtrip";
    			input1.value = input1.__value;
    			/*$$binding_groups*/ ctx[17][0].push(input1);
    			add_location(input1, file$9, 95, 6, 2445);
    			add_location(label1, file$9, 93, 4, 2414);
    			attr_dev(div0, "class", "row svelte-1rg9eup");
    			add_location(div0, file$9, 88, 2, 2289);
    			add_location(label2, file$9, 100, 4, 2551);
    			attr_dev(div1, "class", "row svelte-1rg9eup");
    			add_location(div1, file$9, 99, 2, 2529);
    			add_location(label3, file$9, 113, 4, 2931);
    			attr_dev(div2, "class", "row svelte-1rg9eup");
    			add_location(div2, file$9, 112, 2, 2909);
    			attr_dev(input2, "type", "date");
    			add_location(input2, file$9, 128, 6, 3335);
    			add_location(label4, file$9, 126, 4, 3307);
    			attr_dev(div3, "class", "row svelte-1rg9eup");
    			add_location(div3, file$9, 125, 2, 3285);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "min", "0");
    			attr_dev(input3, "max", "2");
    			attr_dev(input3, "step", "1");
    			input3.value = input3_value_value = 1;
    			add_location(input3, file$9, 140, 4, 3615);
    			attr_dev(div4, "class", "row row--filter svelte-1rg9eup");
    			add_location(div4, file$9, 138, 2, 3566);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "min", "1");
    			attr_dev(input4, "max", "2880");
    			attr_dev(input4, "step", "1");
    			input4.value = input4_value_value = 1440;
    			add_location(input4, file$9, 150, 4, 3816);
    			attr_dev(div5, "class", "row row--filter svelte-1rg9eup");
    			add_location(div5, file$9, 148, 2, 3754);
    			attr_dev(input5, "type", "hidden");
    			add_location(input5, file$9, 167, 4, 4329);
    			attr_dev(div6, "class", "row row--filter svelte-1rg9eup");
    			add_location(div6, file$9, 158, 2, 3961);
    			attr_dev(button, "class", "btn btn-submit svelte-1rg9eup");
    			add_location(button, file$9, 171, 4, 4433);
    			attr_dev(div7, "class", "row row--submit svelte-1rg9eup");
    			add_location(div7, file$9, 170, 2, 4399);
    			attr_dev(div8, "class", "flight-picker-wrapper svelte-1rg9eup");
    			add_location(div8, file$9, 86, 0, 2250);

    			dispose = [
    				listen_dev(input0, "change", /*input0_change_handler*/ ctx[16]),
    				listen_dev(input1, "change", /*input1_change_handler*/ ctx[18]),
    				listen_dev(input2, "input", /*input2_input_handler*/ ctx[21]),
    				listen_dev(input3, "input", input3_input_handler),
    				listen_dev(input4, "input", input4_input_handler),
    				listen_dev(input5, "input", /*input5_input_handler*/ ctx[26]),
    				listen_dev(button, "click", /*initSearch*/ ctx[9], false, false, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div0);
    			append_dev(div0, label0);
    			append_dev(label0, t0);
    			append_dev(label0, input0);
    			input0.checked = input0.__value === /*type*/ ctx[0];
    			append_dev(div0, t1);
    			append_dev(div0, label1);
    			append_dev(label1, t2);
    			append_dev(label1, input1);
    			input1.checked = input1.__value === /*type*/ ctx[0];
    			append_dev(div8, t3);
    			append_dev(div8, div1);
    			append_dev(div1, label2);
    			append_dev(label2, t4);
    			mount_component(select0, label2, null);
    			append_dev(div8, t5);
    			append_dev(div8, div2);
    			append_dev(div2, label3);
    			append_dev(label3, t6);
    			mount_component(select1, label3, null);
    			append_dev(div8, t7);
    			append_dev(div8, div3);
    			append_dev(div3, label4);
    			append_dev(label4, t8);
    			append_dev(label4, input2);
    			set_input_value(input2, /*depart_date*/ ctx[3]);
    			append_dev(div3, t9);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div8, t10);
    			append_dev(div8, div4);
    			append_dev(div4, t11);
    			append_dev(div4, input3);
    			set_input_value(input3, /*filter_max_layovers*/ ctx[6]);
    			append_dev(div8, t12);
    			append_dev(div8, div5);
    			append_dev(div5, t13);
    			append_dev(div5, input4);
    			set_input_value(input4, /*filter_max_duration*/ ctx[5]);
    			append_dev(div8, t14);
    			append_dev(div8, div6);
    			append_dev(div6, t15);
    			mount_component(select2, div6, null);
    			append_dev(div6, t16);
    			append_dev(div6, input5);
    			set_input_value(input5, /*filter_min_depart_at*/ ctx[7]);
    			append_dev(div8, t17);
    			append_dev(div8, div7);
    			append_dev(div7, button);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*type*/ 1) {
    				input0.checked = input0.__value === /*type*/ ctx[0];
    			}

    			if (dirty & /*type*/ 1) {
    				input1.checked = input1.__value === /*type*/ ctx[0];
    			}

    			const select0_changes = {};

    			if (!updating_selectedValue && dirty & /*from_airport*/ 2) {
    				updating_selectedValue = true;
    				select0_changes.selectedValue = /*from_airport*/ ctx[1];
    				add_flush_callback(() => updating_selectedValue = false);
    			}

    			select0.$set(select0_changes);
    			const select1_changes = {};

    			if (!updating_selectedValue_1 && dirty & /*to_airport*/ 4) {
    				updating_selectedValue_1 = true;
    				select1_changes.selectedValue = /*to_airport*/ ctx[2];
    				add_flush_callback(() => updating_selectedValue_1 = false);
    			}

    			select1.$set(select1_changes);

    			if (dirty & /*depart_date*/ 8) {
    				set_input_value(input2, /*depart_date*/ ctx[3]);
    			}

    			if (/*type*/ ctx[0] === "roundtrip") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!input3_updating && dirty & /*filter_max_layovers*/ 64) {
    				set_input_value(input3, /*filter_max_layovers*/ ctx[6]);
    			}

    			input3_updating = false;

    			if (!input4_updating && dirty & /*filter_max_duration*/ 32) {
    				set_input_value(input4, /*filter_max_duration*/ ctx[5]);
    			}

    			input4_updating = false;
    			const select2_changes = {};

    			if (!updating_selectedValue_2 && dirty & /*filter_restricted_airline*/ 256) {
    				updating_selectedValue_2 = true;
    				select2_changes.selectedValue = /*filter_restricted_airline*/ ctx[8];
    				add_flush_callback(() => updating_selectedValue_2 = false);
    			}

    			select2.$set(select2_changes);

    			if (dirty & /*filter_min_depart_at*/ 128) {
    				set_input_value(input5, /*filter_min_depart_at*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select0.$$.fragment, local);
    			transition_in(select1.$$.fragment, local);
    			transition_in(select2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select0.$$.fragment, local);
    			transition_out(select1.$$.fragment, local);
    			transition_out(select2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			/*$$binding_groups*/ ctx[17][0].splice(/*$$binding_groups*/ ctx[17][0].indexOf(input0), 1);
    			/*$$binding_groups*/ ctx[17][0].splice(/*$$binding_groups*/ ctx[17][0].indexOf(input1), 1);
    			destroy_component(select0);
    			destroy_component(select1);
    			if (if_block) if_block.d();
    			destroy_component(select2);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = option => option.iata_code + " - " + option.name;
    const func_1 = option => option.iata_code + " - " + option.name;
    const func_2 = option => option.iata_code + " - " + option.name;
    const func_3 = option => option.iata_code + " - " + option.name;
    const func_4 = option => option.name + ` (${option.iata_code})`;
    const func_5 = option => option.name + ` (${option.iata_code})`;

    function instance$9($$self, $$props, $$invalidate) {
    	let $app_errors;
    	validate_store(app_errors, "app_errors");
    	component_subscribe($$self, app_errors, $$value => $$invalidate(14, $app_errors = $$value));
    	let { type = "one-way" } = $$props;
    	const dispatch = createEventDispatcher();
    	let from_airport;
    	let to_airport;
    	let depart_date;
    	let return_date;
    	let filters = {};
    	let filter_max_duration = 1440;
    	let filter_max_layovers = 1;
    	let filter_min_depart_at = "";
    	let filter_restricted_airline;
    	let search_query = {};

    	function initSearch() {
    		dispatch("search", { search_query, filters });
    	}

    	async function findAirports(search_term) {
    		const response = await getData("/api/airports", { search: search_term });

    		if (response.data) {
    			return response.data;
    		} else if (response.errors) {
    			set_store_value(app_errors, $app_errors = [...$app_errors, ...response.errors]);
    		}
    	}

    	async function findAirlines(search_term) {
    		const response = await getData("/api/airlines", { search: search_term });

    		if (response.data) {
    			return response.data;
    		} else if (response.errors) {
    			set_store_value(app_errors, $app_errors = [...$app_errors, ...response.errors]);
    		}
    	}

    	const writable_props = ["type"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FlightRoutePicker> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input0_change_handler() {
    		type = this.__value;
    		$$invalidate(0, type);
    	}

    	function input1_change_handler() {
    		type = this.__value;
    		$$invalidate(0, type);
    	}

    	function select0_selectedValue_binding(value) {
    		from_airport = value;
    		$$invalidate(1, from_airport);
    	}

    	function select1_selectedValue_binding(value_1) {
    		to_airport = value_1;
    		$$invalidate(2, to_airport);
    	}

    	function input2_input_handler() {
    		depart_date = this.value;
    		$$invalidate(3, depart_date);
    	}

    	function input_input_handler() {
    		return_date = this.value;
    		$$invalidate(4, return_date);
    	}

    	function input3_input_handler() {
    		filter_max_layovers = to_number(this.value);
    		$$invalidate(6, filter_max_layovers);
    	}

    	function input4_input_handler() {
    		filter_max_duration = to_number(this.value);
    		$$invalidate(5, filter_max_duration);
    	}

    	function select2_selectedValue_binding(value_2) {
    		filter_restricted_airline = value_2;
    		$$invalidate(8, filter_restricted_airline);
    	}

    	function input5_input_handler() {
    		filter_min_depart_at = this.value;
    		$$invalidate(7, filter_min_depart_at);
    	}

    	$$self.$set = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    	};

    	$$self.$capture_state = () => {
    		return {
    			type,
    			from_airport,
    			to_airport,
    			depart_date,
    			return_date,
    			filters,
    			filter_max_duration,
    			filter_max_layovers,
    			filter_min_depart_at,
    			filter_restricted_airline,
    			search_query,
    			$app_errors
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    		if ("from_airport" in $$props) $$invalidate(1, from_airport = $$props.from_airport);
    		if ("to_airport" in $$props) $$invalidate(2, to_airport = $$props.to_airport);
    		if ("depart_date" in $$props) $$invalidate(3, depart_date = $$props.depart_date);
    		if ("return_date" in $$props) $$invalidate(4, return_date = $$props.return_date);
    		if ("filters" in $$props) filters = $$props.filters;
    		if ("filter_max_duration" in $$props) $$invalidate(5, filter_max_duration = $$props.filter_max_duration);
    		if ("filter_max_layovers" in $$props) $$invalidate(6, filter_max_layovers = $$props.filter_max_layovers);
    		if ("filter_min_depart_at" in $$props) $$invalidate(7, filter_min_depart_at = $$props.filter_min_depart_at);
    		if ("filter_restricted_airline" in $$props) $$invalidate(8, filter_restricted_airline = $$props.filter_restricted_airline);
    		if ("search_query" in $$props) search_query = $$props.search_query;
    		if ("$app_errors" in $$props) app_errors.set($app_errors = $$props.$app_errors);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*filter_max_duration, filter_max_layovers, filter_min_depart_at, filter_restricted_airline*/ 480) {
    			 filters = {
    				max_duration: filter_max_duration,
    				max_layovers: filter_max_layovers,
    				min_depart_at: filter_min_depart_at,
    				restricted_airline: filter_restricted_airline && filter_restricted_airline.id
    				? filter_restricted_airline.id
    				: undefined
    			};
    		}

    		if ($$self.$$.dirty & /*from_airport, to_airport, depart_date, type, return_date*/ 31) {
    			 search_query = {
    				from: from_airport && from_airport.id
    				? from_airport.id
    				: undefined,
    				to: to_airport && to_airport.id ? to_airport.id : undefined,
    				depart_date: depart_date || null,
    				return_date: type === "roundtrip" ? return_date : null
    			};
    		}
    	};

    	return [
    		type,
    		from_airport,
    		to_airport,
    		depart_date,
    		return_date,
    		filter_max_duration,
    		filter_max_layovers,
    		filter_min_depart_at,
    		filter_restricted_airline,
    		initSearch,
    		findAirports,
    		findAirlines,
    		filters,
    		search_query,
    		$app_errors,
    		dispatch,
    		input0_change_handler,
    		$$binding_groups,
    		input1_change_handler,
    		select0_selectedValue_binding,
    		select1_selectedValue_binding,
    		input2_input_handler,
    		input_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		select2_selectedValue_binding,
    		input5_input_handler
    	];
    }

    class FlightRoutePicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$a, safe_not_equal, { type: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FlightRoutePicker",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get type() {
    		throw new Error("<FlightRoutePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<FlightRoutePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * Calls a given function and keeps calling it after the specified delay has passed.
     *
     * @param {() => any} fn The function to call.
     * @param {number} delay The delay (in milliseconds) to wait before calling the function again.
     * @param {() => boolean} shouldStopPolling A callback function indicating whether to stop polling.
     */
    async function poll(fn, delay, shouldStopPolling = () => false) {
        if (typeof delay !== 'number') {
            throw new TypeError(`Expected “delay” to be of type number, but it was of type ${typeof delay}.`);
        }
        delay = Math.max(0, delay);
        do {
            await fn();
            if (shouldStopPolling()) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        } while (!shouldStopPolling());
    }

    /* src/comp/FlyingSegment.svelte generated by Svelte v3.16.7 */

    const file$a = "src/comp/FlyingSegment.svelte";

    function create_fragment$b(ctx) {
    	let div4;
    	let div0;
    	let t0;
    	let t1;
    	let br0;
    	let t2;
    	let t3;
    	let t4;
    	let div1;
    	let span0;
    	let t5;
    	let t6;
    	let br1;
    	let t7;
    	let span1;
    	let t8;
    	let t9;
    	let div2;
    	let span2;
    	let t10;
    	let t11;
    	let br2;
    	let t12;
    	let span3;
    	let t13;
    	let t14;
    	let div3;
    	let t15;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			t0 = text(/*airline_name*/ ctx[3]);
    			t1 = space();
    			br0 = element("br");
    			t2 = space();
    			t3 = text(/*flight_code*/ ctx[4]);
    			t4 = space();
    			div1 = element("div");
    			span0 = element("span");
    			t5 = text(/*starts_at*/ ctx[0]);
    			t6 = space();
    			br1 = element("br");
    			t7 = space();
    			span1 = element("span");
    			t8 = text(/*location_from*/ ctx[5]);
    			t9 = space();
    			div2 = element("div");
    			span2 = element("span");
    			t10 = text(/*ends_at*/ ctx[1]);
    			t11 = space();
    			br2 = element("br");
    			t12 = space();
    			span3 = element("span");
    			t13 = text(/*location_to*/ ctx[6]);
    			t14 = space();
    			div3 = element("div");
    			t15 = text(/*duration*/ ctx[2]);
    			add_location(br0, file$a, 30, 4, 738);
    			attr_dev(div0, "class", "svelte-nci46n");
    			add_location(div0, file$a, 28, 2, 709);
    			add_location(span0, file$a, 35, 4, 785);
    			add_location(br1, file$a, 36, 4, 814);
    			add_location(span1, file$a, 37, 4, 825);
    			attr_dev(div1, "class", "svelte-nci46n");
    			add_location(div1, file$a, 34, 2, 775);
    			add_location(span2, file$a, 41, 4, 876);
    			add_location(br2, file$a, 42, 4, 903);
    			add_location(span3, file$a, 43, 4, 914);
    			attr_dev(div2, "class", "svelte-nci46n");
    			add_location(div2, file$a, 40, 2, 866);
    			attr_dev(div3, "class", "svelte-nci46n");
    			add_location(div3, file$a, 46, 2, 953);
    			attr_dev(div4, "class", "segment-wrapper svelte-nci46n");
    			add_location(div4, file$a, 27, 0, 677);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, br0);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div4, t4);
    			append_dev(div4, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t5);
    			append_dev(div1, t6);
    			append_dev(div1, br1);
    			append_dev(div1, t7);
    			append_dev(div1, span1);
    			append_dev(span1, t8);
    			append_dev(div4, t9);
    			append_dev(div4, div2);
    			append_dev(div2, span2);
    			append_dev(span2, t10);
    			append_dev(div2, t11);
    			append_dev(div2, br2);
    			append_dev(div2, t12);
    			append_dev(div2, span3);
    			append_dev(span3, t13);
    			append_dev(div4, t14);
    			append_dev(div4, div3);
    			append_dev(div3, t15);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*airline_name*/ 8) set_data_dev(t0, /*airline_name*/ ctx[3]);
    			if (dirty & /*flight_code*/ 16) set_data_dev(t3, /*flight_code*/ ctx[4]);
    			if (dirty & /*starts_at*/ 1) set_data_dev(t5, /*starts_at*/ ctx[0]);
    			if (dirty & /*location_from*/ 32) set_data_dev(t8, /*location_from*/ ctx[5]);
    			if (dirty & /*ends_at*/ 2) set_data_dev(t10, /*ends_at*/ ctx[1]);
    			if (dirty & /*location_to*/ 64) set_data_dev(t13, /*location_to*/ ctx[6]);
    			if (dirty & /*duration*/ 4) set_data_dev(t15, /*duration*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { type } = $$props;
    	let { starts_at } = $$props;
    	let { ends_at } = $$props;
    	let { duration } = $$props;
    	let { airline_name } = $$props;
    	let { flight_code } = $$props;
    	let { location_from } = $$props;
    	let { location_to } = $$props;
    	let { starts_at_timestamp } = $$props;
    	let { ends_at_timestamp } = $$props;

    	const writable_props = [
    		"type",
    		"starts_at",
    		"ends_at",
    		"duration",
    		"airline_name",
    		"flight_code",
    		"location_from",
    		"location_to",
    		"starts_at_timestamp",
    		"ends_at_timestamp"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FlyingSegment> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("type" in $$props) $$invalidate(7, type = $$props.type);
    		if ("starts_at" in $$props) $$invalidate(0, starts_at = $$props.starts_at);
    		if ("ends_at" in $$props) $$invalidate(1, ends_at = $$props.ends_at);
    		if ("duration" in $$props) $$invalidate(2, duration = $$props.duration);
    		if ("airline_name" in $$props) $$invalidate(3, airline_name = $$props.airline_name);
    		if ("flight_code" in $$props) $$invalidate(4, flight_code = $$props.flight_code);
    		if ("location_from" in $$props) $$invalidate(5, location_from = $$props.location_from);
    		if ("location_to" in $$props) $$invalidate(6, location_to = $$props.location_to);
    		if ("starts_at_timestamp" in $$props) $$invalidate(8, starts_at_timestamp = $$props.starts_at_timestamp);
    		if ("ends_at_timestamp" in $$props) $$invalidate(9, ends_at_timestamp = $$props.ends_at_timestamp);
    	};

    	$$self.$capture_state = () => {
    		return {
    			type,
    			starts_at,
    			ends_at,
    			duration,
    			airline_name,
    			flight_code,
    			location_from,
    			location_to,
    			starts_at_timestamp,
    			ends_at_timestamp
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(7, type = $$props.type);
    		if ("starts_at" in $$props) $$invalidate(0, starts_at = $$props.starts_at);
    		if ("ends_at" in $$props) $$invalidate(1, ends_at = $$props.ends_at);
    		if ("duration" in $$props) $$invalidate(2, duration = $$props.duration);
    		if ("airline_name" in $$props) $$invalidate(3, airline_name = $$props.airline_name);
    		if ("flight_code" in $$props) $$invalidate(4, flight_code = $$props.flight_code);
    		if ("location_from" in $$props) $$invalidate(5, location_from = $$props.location_from);
    		if ("location_to" in $$props) $$invalidate(6, location_to = $$props.location_to);
    		if ("starts_at_timestamp" in $$props) $$invalidate(8, starts_at_timestamp = $$props.starts_at_timestamp);
    		if ("ends_at_timestamp" in $$props) $$invalidate(9, ends_at_timestamp = $$props.ends_at_timestamp);
    	};

    	return [
    		starts_at,
    		ends_at,
    		duration,
    		airline_name,
    		flight_code,
    		location_from,
    		location_to,
    		type,
    		starts_at_timestamp,
    		ends_at_timestamp
    	];
    }

    class FlyingSegment extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$b, safe_not_equal, {
    			type: 7,
    			starts_at: 0,
    			ends_at: 1,
    			duration: 2,
    			airline_name: 3,
    			flight_code: 4,
    			location_from: 5,
    			location_to: 6,
    			starts_at_timestamp: 8,
    			ends_at_timestamp: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FlyingSegment",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*type*/ ctx[7] === undefined && !("type" in props)) {
    			console.warn("<FlyingSegment> was created without expected prop 'type'");
    		}

    		if (/*starts_at*/ ctx[0] === undefined && !("starts_at" in props)) {
    			console.warn("<FlyingSegment> was created without expected prop 'starts_at'");
    		}

    		if (/*ends_at*/ ctx[1] === undefined && !("ends_at" in props)) {
    			console.warn("<FlyingSegment> was created without expected prop 'ends_at'");
    		}

    		if (/*duration*/ ctx[2] === undefined && !("duration" in props)) {
    			console.warn("<FlyingSegment> was created without expected prop 'duration'");
    		}

    		if (/*airline_name*/ ctx[3] === undefined && !("airline_name" in props)) {
    			console.warn("<FlyingSegment> was created without expected prop 'airline_name'");
    		}

    		if (/*flight_code*/ ctx[4] === undefined && !("flight_code" in props)) {
    			console.warn("<FlyingSegment> was created without expected prop 'flight_code'");
    		}

    		if (/*location_from*/ ctx[5] === undefined && !("location_from" in props)) {
    			console.warn("<FlyingSegment> was created without expected prop 'location_from'");
    		}

    		if (/*location_to*/ ctx[6] === undefined && !("location_to" in props)) {
    			console.warn("<FlyingSegment> was created without expected prop 'location_to'");
    		}

    		if (/*starts_at_timestamp*/ ctx[8] === undefined && !("starts_at_timestamp" in props)) {
    			console.warn("<FlyingSegment> was created without expected prop 'starts_at_timestamp'");
    		}

    		if (/*ends_at_timestamp*/ ctx[9] === undefined && !("ends_at_timestamp" in props)) {
    			console.warn("<FlyingSegment> was created without expected prop 'ends_at_timestamp'");
    		}
    	}

    	get type() {
    		throw new Error("<FlyingSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<FlyingSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get starts_at() {
    		throw new Error("<FlyingSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set starts_at(value) {
    		throw new Error("<FlyingSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ends_at() {
    		throw new Error("<FlyingSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ends_at(value) {
    		throw new Error("<FlyingSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<FlyingSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<FlyingSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get airline_name() {
    		throw new Error("<FlyingSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set airline_name(value) {
    		throw new Error("<FlyingSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flight_code() {
    		throw new Error("<FlyingSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flight_code(value) {
    		throw new Error("<FlyingSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get location_from() {
    		throw new Error("<FlyingSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set location_from(value) {
    		throw new Error("<FlyingSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get location_to() {
    		throw new Error("<FlyingSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set location_to(value) {
    		throw new Error("<FlyingSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get starts_at_timestamp() {
    		throw new Error("<FlyingSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set starts_at_timestamp(value) {
    		throw new Error("<FlyingSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ends_at_timestamp() {
    		throw new Error("<FlyingSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ends_at_timestamp(value) {
    		throw new Error("<FlyingSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/comp/LayoverSegment.svelte generated by Svelte v3.16.7 */

    const file$b = "src/comp/LayoverSegment.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(/*duration*/ ctx[0]);
    			t1 = text(" layover");
    			attr_dev(div, "class", "segment-wrapper svelte-nyx5ek");
    			add_location(div, file$b, 18, 0, 425);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*duration*/ 1) set_data_dev(t0, /*duration*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { type } = $$props;
    	let { starts_at } = $$props;
    	let { ends_at } = $$props;
    	let { duration } = $$props;
    	let { starts_at_timestamp } = $$props;
    	let { ends_at_timestamp } = $$props;

    	const writable_props = [
    		"type",
    		"starts_at",
    		"ends_at",
    		"duration",
    		"starts_at_timestamp",
    		"ends_at_timestamp"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LayoverSegment> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    		if ("starts_at" in $$props) $$invalidate(2, starts_at = $$props.starts_at);
    		if ("ends_at" in $$props) $$invalidate(3, ends_at = $$props.ends_at);
    		if ("duration" in $$props) $$invalidate(0, duration = $$props.duration);
    		if ("starts_at_timestamp" in $$props) $$invalidate(4, starts_at_timestamp = $$props.starts_at_timestamp);
    		if ("ends_at_timestamp" in $$props) $$invalidate(5, ends_at_timestamp = $$props.ends_at_timestamp);
    	};

    	$$self.$capture_state = () => {
    		return {
    			type,
    			starts_at,
    			ends_at,
    			duration,
    			starts_at_timestamp,
    			ends_at_timestamp
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    		if ("starts_at" in $$props) $$invalidate(2, starts_at = $$props.starts_at);
    		if ("ends_at" in $$props) $$invalidate(3, ends_at = $$props.ends_at);
    		if ("duration" in $$props) $$invalidate(0, duration = $$props.duration);
    		if ("starts_at_timestamp" in $$props) $$invalidate(4, starts_at_timestamp = $$props.starts_at_timestamp);
    		if ("ends_at_timestamp" in $$props) $$invalidate(5, ends_at_timestamp = $$props.ends_at_timestamp);
    	};

    	return [duration, type, starts_at, ends_at, starts_at_timestamp, ends_at_timestamp];
    }

    class LayoverSegment extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$c, safe_not_equal, {
    			type: 1,
    			starts_at: 2,
    			ends_at: 3,
    			duration: 0,
    			starts_at_timestamp: 4,
    			ends_at_timestamp: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayoverSegment",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*type*/ ctx[1] === undefined && !("type" in props)) {
    			console.warn("<LayoverSegment> was created without expected prop 'type'");
    		}

    		if (/*starts_at*/ ctx[2] === undefined && !("starts_at" in props)) {
    			console.warn("<LayoverSegment> was created without expected prop 'starts_at'");
    		}

    		if (/*ends_at*/ ctx[3] === undefined && !("ends_at" in props)) {
    			console.warn("<LayoverSegment> was created without expected prop 'ends_at'");
    		}

    		if (/*duration*/ ctx[0] === undefined && !("duration" in props)) {
    			console.warn("<LayoverSegment> was created without expected prop 'duration'");
    		}

    		if (/*starts_at_timestamp*/ ctx[4] === undefined && !("starts_at_timestamp" in props)) {
    			console.warn("<LayoverSegment> was created without expected prop 'starts_at_timestamp'");
    		}

    		if (/*ends_at_timestamp*/ ctx[5] === undefined && !("ends_at_timestamp" in props)) {
    			console.warn("<LayoverSegment> was created without expected prop 'ends_at_timestamp'");
    		}
    	}

    	get type() {
    		throw new Error("<LayoverSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<LayoverSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get starts_at() {
    		throw new Error("<LayoverSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set starts_at(value) {
    		throw new Error("<LayoverSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ends_at() {
    		throw new Error("<LayoverSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ends_at(value) {
    		throw new Error("<LayoverSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<LayoverSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<LayoverSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get starts_at_timestamp() {
    		throw new Error("<LayoverSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set starts_at_timestamp(value) {
    		throw new Error("<LayoverSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ends_at_timestamp() {
    		throw new Error("<LayoverSegment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ends_at_timestamp(value) {
    		throw new Error("<LayoverSegment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/comp/FlightInfo.svelte generated by Svelte v3.16.7 */
    const file$c = "src/comp/FlightInfo.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (67:40) 
    function create_if_block_2$2(ctx) {
    	let current;
    	const layoversegment_spread_levels = [/*segment*/ ctx[10]];
    	let layoversegment_props = {};

    	for (let i = 0; i < layoversegment_spread_levels.length; i += 1) {
    		layoversegment_props = assign(layoversegment_props, layoversegment_spread_levels[i]);
    	}

    	const layoversegment = new LayoverSegment({
    			props: layoversegment_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layoversegment.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(layoversegment, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layoversegment_changes = (dirty & /*route_segments*/ 8)
    			? get_spread_update(layoversegment_spread_levels, [get_spread_object(/*segment*/ ctx[10])])
    			: {};

    			layoversegment.$set(layoversegment_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layoversegment.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layoversegment.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layoversegment, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(67:40) ",
    		ctx
    	});

    	return block;
    }

    // (65:4) {#if segment.type == 'flying'}
    function create_if_block_1$2(ctx) {
    	let current;
    	const flyingsegment_spread_levels = [/*segment*/ ctx[10]];
    	let flyingsegment_props = {};

    	for (let i = 0; i < flyingsegment_spread_levels.length; i += 1) {
    		flyingsegment_props = assign(flyingsegment_props, flyingsegment_spread_levels[i]);
    	}

    	const flyingsegment = new FlyingSegment({
    			props: flyingsegment_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(flyingsegment.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(flyingsegment, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const flyingsegment_changes = (dirty & /*route_segments*/ 8)
    			? get_spread_update(flyingsegment_spread_levels, [get_spread_object(/*segment*/ ctx[10])])
    			: {};

    			flyingsegment.$set(flyingsegment_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flyingsegment.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flyingsegment.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(flyingsegment, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(65:4) {#if segment.type == 'flying'}",
    		ctx
    	});

    	return block;
    }

    // (64:2) {#each route_segments as segment}
    function create_each_block$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_if_block_2$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*segment*/ ctx[10].type == "flying") return 0;
    		if (/*segment*/ ctx[10].type == "layover") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(64:2) {#each route_segments as segment}",
    		ctx
    	});

    	return block;
    }

    // (74:50) {:else}
    function create_else_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("direct flight");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(74:50) {:else}",
    		ctx
    	});

    	return block;
    }

    // (74:4) {#if total_layovers > 0}
    function create_if_block$4(ctx) {
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(/*total_layovers*/ ctx[2]);
    			t1 = text(" stops");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*total_layovers*/ 4) set_data_dev(t0, /*total_layovers*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(74:4) {#if total_layovers > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div2;
    	let div0;
    	let button;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let div1;
    	let t5;
    	let t6;
    	let current;
    	let dispose;
    	let each_value = /*route_segments*/ ctx[3];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	function select_block_type_1(ctx, dirty) {
    		if (/*total_layovers*/ ctx[2] > 0) return create_if_block$4;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			button = element("button");
    			button.textContent = "Select";
    			t1 = text("\n    $");
    			t2 = text(/*total_price*/ ctx[1]);
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div1 = element("div");
    			t5 = text(/*total_duration_human*/ ctx[0]);
    			t6 = text(" trip time |\n    ");
    			if_block.c();
    			attr_dev(button, "class", "btn btn--select svelte-o6da19");
    			add_location(button, file$c, 59, 4, 1302);
    			attr_dev(div0, "class", "total-price header svelte-o6da19");
    			add_location(div0, file$c, 58, 2, 1265);
    			attr_dev(div1, "class", "footer svelte-o6da19");
    			add_location(div1, file$c, 71, 2, 1611);
    			attr_dev(div2, "class", "flight-wrapper svelte-o6da19");
    			add_location(div2, file$c, 57, 0, 1234);
    			dispose = listen_dev(button, "click", /*pickFlight*/ ctx[4], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, button);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div2, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, t5);
    			append_dev(div1, t6);
    			if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*total_price*/ 2) set_data_dev(t2, /*total_price*/ ctx[1]);

    			if (dirty & /*route_segments*/ 8) {
    				each_value = /*route_segments*/ ctx[3];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div2, t4);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*total_duration_human*/ 1) set_data_dev(t5, /*total_duration_human*/ ctx[0]);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			if_block.d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { result_id } = $$props;
    	let { flight_date } = $$props;
    	let { ends_at_timestamp } = $$props;
    	let { total_duration } = $$props;
    	let { total_duration_human } = $$props;
    	let { total_price } = $$props;
    	let { total_layovers } = $$props;
    	let { route_segments } = $$props;
    	const dispatch = createEventDispatcher();

    	function pickFlight() {
    		dispatch("flightPicked", {
    			result_id,
    			flight_date,
    			ends_at_timestamp
    		});
    	}

    	const writable_props = [
    		"result_id",
    		"flight_date",
    		"ends_at_timestamp",
    		"total_duration",
    		"total_duration_human",
    		"total_price",
    		"total_layovers",
    		"route_segments"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FlightInfo> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("result_id" in $$props) $$invalidate(5, result_id = $$props.result_id);
    		if ("flight_date" in $$props) $$invalidate(6, flight_date = $$props.flight_date);
    		if ("ends_at_timestamp" in $$props) $$invalidate(7, ends_at_timestamp = $$props.ends_at_timestamp);
    		if ("total_duration" in $$props) $$invalidate(8, total_duration = $$props.total_duration);
    		if ("total_duration_human" in $$props) $$invalidate(0, total_duration_human = $$props.total_duration_human);
    		if ("total_price" in $$props) $$invalidate(1, total_price = $$props.total_price);
    		if ("total_layovers" in $$props) $$invalidate(2, total_layovers = $$props.total_layovers);
    		if ("route_segments" in $$props) $$invalidate(3, route_segments = $$props.route_segments);
    	};

    	$$self.$capture_state = () => {
    		return {
    			result_id,
    			flight_date,
    			ends_at_timestamp,
    			total_duration,
    			total_duration_human,
    			total_price,
    			total_layovers,
    			route_segments
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("result_id" in $$props) $$invalidate(5, result_id = $$props.result_id);
    		if ("flight_date" in $$props) $$invalidate(6, flight_date = $$props.flight_date);
    		if ("ends_at_timestamp" in $$props) $$invalidate(7, ends_at_timestamp = $$props.ends_at_timestamp);
    		if ("total_duration" in $$props) $$invalidate(8, total_duration = $$props.total_duration);
    		if ("total_duration_human" in $$props) $$invalidate(0, total_duration_human = $$props.total_duration_human);
    		if ("total_price" in $$props) $$invalidate(1, total_price = $$props.total_price);
    		if ("total_layovers" in $$props) $$invalidate(2, total_layovers = $$props.total_layovers);
    		if ("route_segments" in $$props) $$invalidate(3, route_segments = $$props.route_segments);
    	};

    	return [
    		total_duration_human,
    		total_price,
    		total_layovers,
    		route_segments,
    		pickFlight,
    		result_id,
    		flight_date,
    		ends_at_timestamp,
    		total_duration
    	];
    }

    class FlightInfo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$d, safe_not_equal, {
    			result_id: 5,
    			flight_date: 6,
    			ends_at_timestamp: 7,
    			total_duration: 8,
    			total_duration_human: 0,
    			total_price: 1,
    			total_layovers: 2,
    			route_segments: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FlightInfo",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*result_id*/ ctx[5] === undefined && !("result_id" in props)) {
    			console.warn("<FlightInfo> was created without expected prop 'result_id'");
    		}

    		if (/*flight_date*/ ctx[6] === undefined && !("flight_date" in props)) {
    			console.warn("<FlightInfo> was created without expected prop 'flight_date'");
    		}

    		if (/*ends_at_timestamp*/ ctx[7] === undefined && !("ends_at_timestamp" in props)) {
    			console.warn("<FlightInfo> was created without expected prop 'ends_at_timestamp'");
    		}

    		if (/*total_duration*/ ctx[8] === undefined && !("total_duration" in props)) {
    			console.warn("<FlightInfo> was created without expected prop 'total_duration'");
    		}

    		if (/*total_duration_human*/ ctx[0] === undefined && !("total_duration_human" in props)) {
    			console.warn("<FlightInfo> was created without expected prop 'total_duration_human'");
    		}

    		if (/*total_price*/ ctx[1] === undefined && !("total_price" in props)) {
    			console.warn("<FlightInfo> was created without expected prop 'total_price'");
    		}

    		if (/*total_layovers*/ ctx[2] === undefined && !("total_layovers" in props)) {
    			console.warn("<FlightInfo> was created without expected prop 'total_layovers'");
    		}

    		if (/*route_segments*/ ctx[3] === undefined && !("route_segments" in props)) {
    			console.warn("<FlightInfo> was created without expected prop 'route_segments'");
    		}
    	}

    	get result_id() {
    		throw new Error("<FlightInfo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set result_id(value) {
    		throw new Error("<FlightInfo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flight_date() {
    		throw new Error("<FlightInfo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flight_date(value) {
    		throw new Error("<FlightInfo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ends_at_timestamp() {
    		throw new Error("<FlightInfo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ends_at_timestamp(value) {
    		throw new Error("<FlightInfo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get total_duration() {
    		throw new Error("<FlightInfo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set total_duration(value) {
    		throw new Error("<FlightInfo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get total_duration_human() {
    		throw new Error("<FlightInfo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set total_duration_human(value) {
    		throw new Error("<FlightInfo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get total_price() {
    		throw new Error("<FlightInfo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set total_price(value) {
    		throw new Error("<FlightInfo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get total_layovers() {
    		throw new Error("<FlightInfo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set total_layovers(value) {
    		throw new Error("<FlightInfo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get route_segments() {
    		throw new Error("<FlightInfo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set route_segments(value) {
    		throw new Error("<FlightInfo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/comp/SearchResults.svelte generated by Svelte v3.16.7 */
    const file$d = "src/comp/SearchResults.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    const get_current_action_slot_changes = dirty => ({});
    const get_current_action_slot_context = ctx => ({});

    // (47:0) {#if !search_complete}
    function create_if_block_1$3(ctx) {
    	let current;
    	const current_action_slot_template = /*$$slots*/ ctx[9].current_action;
    	const current_action_slot = create_slot(current_action_slot_template, ctx, /*$$scope*/ ctx[8], get_current_action_slot_context);

    	const block = {
    		c: function create() {
    			if (current_action_slot) current_action_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (current_action_slot) {
    				current_action_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (current_action_slot && current_action_slot.p && dirty & /*$$scope*/ 256) {
    				current_action_slot.p(get_slot_context(current_action_slot_template, ctx, /*$$scope*/ ctx[8], get_current_action_slot_context), get_slot_changes(current_action_slot_template, /*$$scope*/ ctx[8], dirty, get_current_action_slot_changes));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(current_action_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(current_action_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (current_action_slot) current_action_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(47:0) {#if !search_complete}",
    		ctx
    	});

    	return block;
    }

    // (51:0) {#if no_results_found}
    function create_if_block$5(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No results found. Try a different search.";
    			add_location(p, file$d, 51, 2, 1255);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(51:0) {#if no_results_found}",
    		ctx
    	});

    	return block;
    }

    // (55:0) {#each ordered_search_results as search_result (search_result.result_id)}
    function create_each_block$4(key_1, ctx) {
    	let first;
    	let current;
    	const flightinfo_spread_levels = [/*search_result*/ ctx[11]];
    	let flightinfo_props = {};

    	for (let i = 0; i < flightinfo_spread_levels.length; i += 1) {
    		flightinfo_props = assign(flightinfo_props, flightinfo_spread_levels[i]);
    	}

    	const flightinfo = new FlightInfo({ props: flightinfo_props, $$inline: true });
    	flightinfo.$on("flightPicked", /*flightPicked_handler*/ ctx[10]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(flightinfo.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(flightinfo, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const flightinfo_changes = (dirty & /*ordered_search_results*/ 2)
    			? get_spread_update(flightinfo_spread_levels, [get_spread_object(/*search_result*/ ctx[11])])
    			: {};

    			flightinfo.$set(flightinfo_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flightinfo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flightinfo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(flightinfo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(55:0) {#each ordered_search_results as search_result (search_result.result_id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let t0;
    	let t1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let if_block0 = !/*search_complete*/ ctx[0] && create_if_block_1$3(ctx);
    	let if_block1 = /*no_results_found*/ ctx[2] && create_if_block$5(ctx);
    	let each_value = /*ordered_search_results*/ ctx[1];
    	const get_key = ctx => /*search_result*/ ctx[11].result_id;

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*search_complete*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*no_results_found*/ ctx[2]) {
    				if (!if_block1) {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const each_value = /*ordered_search_results*/ ctx[1];
    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$4, each_1_anchor, get_each_context$4);
    			check_outros();
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $app_errors;
    	validate_store(app_errors, "app_errors");
    	component_subscribe($$self, app_errors, $$value => $$invalidate(6, $app_errors = $$value));
    	let { search_hash } = $$props;
    	let last_result_id = 0;
    	let search_complete = false;
    	let search_results = [];
    	let ordered_search_results = [];

    	onMount(async () => {
    		poll(pollResults, 1000, () => search_complete == true);
    	});

    	async function pollResults() {
    		const response = await getData("/api/search/" + search_hash, { last_result_id });
    		last_result_id = response.last_result_id;

    		if (response.data) {
    			$$invalidate(0, search_complete = response.search_completed);

    			if (response.data.length > 0) {
    				$$invalidate(5, search_results = [...search_results, ...response.data]);
    			}
    		} else if (response.errors) {
    			set_store_value(app_errors, $app_errors = [...$app_errors, ...response.errors]);
    			$$invalidate(0, search_complete = true);
    		}
    	}

    	const writable_props = ["search_hash"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SearchResults> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	function flightPicked_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("search_hash" in $$props) $$invalidate(3, search_hash = $$props.search_hash);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {
    			search_hash,
    			last_result_id,
    			search_complete,
    			search_results,
    			ordered_search_results,
    			no_results_found,
    			$app_errors
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("search_hash" in $$props) $$invalidate(3, search_hash = $$props.search_hash);
    		if ("last_result_id" in $$props) last_result_id = $$props.last_result_id;
    		if ("search_complete" in $$props) $$invalidate(0, search_complete = $$props.search_complete);
    		if ("search_results" in $$props) $$invalidate(5, search_results = $$props.search_results);
    		if ("ordered_search_results" in $$props) $$invalidate(1, ordered_search_results = $$props.ordered_search_results);
    		if ("no_results_found" in $$props) $$invalidate(2, no_results_found = $$props.no_results_found);
    		if ("$app_errors" in $$props) app_errors.set($app_errors = $$props.$app_errors);
    	};

    	let no_results_found;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*search_complete, search_results*/ 33) {
    			 $$invalidate(2, no_results_found = search_complete && search_results.length < 1);
    		}

    		if ($$self.$$.dirty & /*search_results*/ 32) {
    			 {
    				$$invalidate(1, ordered_search_results = [...search_results].sort(function (a, b) {
    					return a.total_price - b.total_price;
    				}));
    			}
    		}
    	};

    	return [
    		search_complete,
    		ordered_search_results,
    		no_results_found,
    		search_hash,
    		last_result_id,
    		search_results,
    		$app_errors,
    		pollResults,
    		$$scope,
    		$$slots,
    		flightPicked_handler
    	];
    }

    class SearchResults extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$e, safe_not_equal, { search_hash: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchResults",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*search_hash*/ ctx[3] === undefined && !("search_hash" in props)) {
    			console.warn("<SearchResults> was created without expected prop 'search_hash'");
    		}
    	}

    	get search_hash() {
    		throw new Error("<SearchResults>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set search_hash(value) {
    		throw new Error("<SearchResults>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/TripNew.svelte generated by Svelte v3.16.7 */
    const file$e = "src/routes/TripNew.svelte";

    // (96:0) {#if !!current_search}
    function create_if_block$6(ctx) {
    	let section;
    	let current;

    	const searchresults = new SearchResults({
    			props: {
    				search_hash: /*current_search*/ ctx[1],
    				$$slots: {
    					default: [create_default_slot$1],
    					current_action: [create_current_action_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	searchresults.$on("flightPicked", /*flightPicked*/ ctx[5]);

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(searchresults.$$.fragment);
    			add_location(section, file$e, 96, 2, 2666);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(searchresults, section, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const searchresults_changes = {};
    			if (dirty & /*current_search*/ 2) searchresults_changes.search_hash = /*current_search*/ ctx[1];

    			if (dirty & /*$$scope, searching_depart_flights, searching_return_flights*/ 8204) {
    				searchresults_changes.$$scope = { dirty, ctx };
    			}

    			searchresults.$set(searchresults_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchresults.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchresults.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(searchresults);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(96:0) {#if !!current_search}",
    		ctx
    	});

    	return block;
    }

    // (102:43) 
    function create_if_block_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Searching for return flights...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(102:43) ",
    		ctx
    	});

    	return block;
    }

    // (100:8) {#if searching_depart_flights}
    function create_if_block_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Searching for depart flights...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(100:8) {#if searching_depart_flights}",
    		ctx
    	});

    	return block;
    }

    // (99:6) <p slot="current_action">
    function create_current_action_slot(ctx) {
    	let p;

    	function select_block_type(ctx, dirty) {
    		if (/*searching_depart_flights*/ ctx[2]) return create_if_block_1$4;
    		if (/*searching_return_flights*/ ctx[3]) return create_if_block_2$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			p = element("p");
    			if (if_block) if_block.c();
    			attr_dev(p, "slot", "current_action");
    			add_location(p, file$e, 98, 6, 2762);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			if (if_block) if_block.m(p, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(p, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_current_action_slot.name,
    		type: "slot",
    		source: "(99:6) <p slot=\\\"current_action\\\">",
    		ctx
    	});

    	return block;
    }

    // (98:4) <SearchResults on:flightPicked={flightPicked} search_hash={current_search}>
    function create_default_slot$1(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(98:4) <SearchResults on:flightPicked={flightPicked} search_hash={current_search}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let section;
    	let updating_type;
    	let t;
    	let if_block_anchor;
    	let current;

    	function flightroutepicker_type_binding(value) {
    		/*flightroutepicker_type_binding*/ ctx[12].call(null, value);
    	}

    	let flightroutepicker_props = {};

    	if (/*trip_type*/ ctx[0] !== void 0) {
    		flightroutepicker_props.type = /*trip_type*/ ctx[0];
    	}

    	const flightroutepicker = new FlightRoutePicker({
    			props: flightroutepicker_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(flightroutepicker, "type", flightroutepicker_type_binding));
    	flightroutepicker.$on("search", /*searchFlights*/ ctx[4]);
    	let if_block = !!/*current_search*/ ctx[1] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(flightroutepicker.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(section, file$e, 91, 0, 2547);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(flightroutepicker, section, null);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const flightroutepicker_changes = {};

    			if (!updating_type && dirty & /*trip_type*/ 1) {
    				updating_type = true;
    				flightroutepicker_changes.type = /*trip_type*/ ctx[0];
    				add_flush_callback(() => updating_type = false);
    			}

    			flightroutepicker.$set(flightroutepicker_changes);

    			if (!!/*current_search*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flightroutepicker.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flightroutepicker.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(flightroutepicker);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $app_errors;
    	validate_store(app_errors, "app_errors");
    	component_subscribe($$self, app_errors, $$value => $$invalidate(8, $app_errors = $$value));
    	let trip_type = "one-way";
    	let trip_itinerary = [];
    	let current_search = null;
    	let search_data = null;
    	let searching_depart_flights;
    	let searching_return_flights;

    	function resetSearch() {
    		search_data = { depart: {}, return: {} };
    		$$invalidate(1, current_search = null);
    		$$invalidate(6, trip_itinerary = []);
    		$$invalidate(2, searching_depart_flights = null);
    		$$invalidate(3, searching_return_flights = null);
    	}

    	function searchFlights(event) {
    		resetSearch();
    		let search_query = Object.assign({}, event.detail.search_query);
    		let filters = Object.assign({}, event.detail.filters);

    		search_data.depart = {
    			from: search_query.from,
    			to: search_query.to,
    			date: search_query.depart_date,
    			filters
    		};

    		if (trip_type === "roundtrip") {
    			search_data.return = {
    				from: search_query.to,
    				to: search_query.from,
    				date: search_query.return_date,
    				filters
    			};
    		}

    		search_data = search_data;
    		runSearch(search_data.depart);
    	}

    	async function runSearch(search_data_obj) {
    		const response = await postData("/api/search", search_data_obj);

    		if (response.search_hash) {
    			$$invalidate(1, current_search = response.search_hash);
    		} else if (response.errors) {
    			set_store_value(app_errors, $app_errors = [...$app_errors, ...response.errors]);
    		}
    	}

    	function flightPicked(event) {
    		$$invalidate(6, trip_itinerary = trip_itinerary.concat([{ result_id: event.detail.result_id }]));
    		$$invalidate(1, current_search = null);

    		if (trip_type === "one-way" && trip_itinerary.length === 1 || trip_type === "roundtrip" && trip_itinerary.length === 2) {
    			createTrip(trip_itinerary);
    		} else {
    			search_data.return.filters.min_depart_at = event.detail.ends_at_timestamp;
    			runSearch(search_data.return);
    		}
    	}

    	async function createTrip(trip_itinerary) {
    		const response = await postData("/api/trips", { trip_itinerary });

    		if (response.data.trip_id) {
    			push("/trips/" + response.data.trip_id);
    		} else if (response.errors) {
    			set_store_value(app_errors, $app_errors = [...$app_errors, ...response.errors]);
    		}
    	}

    	function flightroutepicker_type_binding(value) {
    		trip_type = value;
    		$$invalidate(0, trip_type);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("trip_type" in $$props) $$invalidate(0, trip_type = $$props.trip_type);
    		if ("trip_itinerary" in $$props) $$invalidate(6, trip_itinerary = $$props.trip_itinerary);
    		if ("current_search" in $$props) $$invalidate(1, current_search = $$props.current_search);
    		if ("search_data" in $$props) search_data = $$props.search_data;
    		if ("searching_depart_flights" in $$props) $$invalidate(2, searching_depart_flights = $$props.searching_depart_flights);
    		if ("searching_return_flights" in $$props) $$invalidate(3, searching_return_flights = $$props.searching_return_flights);
    		if ("$app_errors" in $$props) app_errors.set($app_errors = $$props.$app_errors);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*current_search, trip_itinerary*/ 66) {
    			 $$invalidate(2, searching_depart_flights = !!current_search && trip_itinerary.length < 1);
    		}

    		if ($$self.$$.dirty & /*current_search, trip_itinerary*/ 66) {
    			 $$invalidate(3, searching_return_flights = !!current_search && trip_itinerary.length == 1);
    		}
    	};

    	return [
    		trip_type,
    		current_search,
    		searching_depart_flights,
    		searching_return_flights,
    		searchFlights,
    		flightPicked,
    		trip_itinerary,
    		search_data,
    		$app_errors,
    		resetSearch,
    		runSearch,
    		createTrip,
    		flightroutepicker_type_binding
    	];
    }

    class TripNew extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TripNew",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/routes/TripIndex.svelte generated by Svelte v3.16.7 */
    const file$f = "src/routes/TripIndex.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>   import { onMount }
    function create_catch_block(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>   import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (41:0) {:then trips}
    function create_then_block(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*trips*/ ctx[0].length > 0) return create_if_block$7;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(41:0) {:then trips}",
    		ctx
    	});

    	return block;
    }

    // (59:2) {:else}
    function create_else_block$2(ctx) {
    	let p;
    	let t0;
    	let a;
    	let link_action;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("You have no trips schedule.\n      ");
    			a = element("a");
    			a.textContent = "Create trip";
    			attr_dev(a, "href", "/trips/new");
    			add_location(a, file$f, 61, 6, 1305);
    			add_location(p, file$f, 59, 4, 1261);
    			dispose = action_destroyer(link_action = link.call(null, a));
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, a);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(59:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (42:2) {#if trips.length > 0}
    function create_if_block$7(ctx) {
    	let table;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t4;
    	let each_value = /*trips*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Trip name";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Departs at";
    			t3 = space();
    			th2 = element("th");
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(th0, "class", "svelte-1sftz1s");
    			add_location(th0, file$f, 44, 8, 923);
    			attr_dev(th1, "class", "svelte-1sftz1s");
    			add_location(th1, file$f, 45, 8, 950);
    			attr_dev(th2, "class", "svelte-1sftz1s");
    			add_location(th2, file$f, 46, 8, 978);
    			add_location(tr, file$f, 43, 6, 910);
    			attr_dev(table, "class", "svelte-1sftz1s");
    			add_location(table, file$f, 42, 4, 896);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(table, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*trips, displayDate*/ 1) {
    				each_value = /*trips*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(42:2) {#if trips.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (49:6) {#each trips as trip}
    function create_each_block$5(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*trip*/ ctx[3].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = displayDate(/*trip*/ ctx[3].depart_at) + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let t4;
    	let a_href_value;
    	let link_action;
    	let t5;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			t4 = text("Show");
    			t5 = space();
    			attr_dev(td0, "class", "svelte-1sftz1s");
    			add_location(td0, file$f, 50, 10, 1048);
    			attr_dev(td1, "class", "svelte-1sftz1s");
    			add_location(td1, file$f, 51, 10, 1079);
    			attr_dev(a, "href", a_href_value = "/trips/" + /*trip*/ ctx[3].id);
    			add_location(a, file$f, 53, 12, 1145);
    			attr_dev(td2, "class", "svelte-1sftz1s");
    			add_location(td2, file$f, 52, 10, 1128);
    			add_location(tr, file$f, 49, 8, 1033);
    			dispose = action_destroyer(link_action = link.call(null, a));
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, t4);
    			append_dev(tr, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*trips*/ 1 && t0_value !== (t0_value = /*trip*/ ctx[3].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*trips*/ 1 && t2_value !== (t2_value = displayDate(/*trip*/ ctx[3].depart_at) + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*trips*/ 1 && a_href_value !== (a_href_value = "/trips/" + /*trip*/ ctx[3].id)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(49:6) {#each trips as trip}",
    		ctx
    	});

    	return block;
    }

    // (39:14)    Fetching trip data... {:then trips}
    function create_pending_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Fetching trip data...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(39:14)    Fetching trip data... {:then trips}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let await_block_anchor;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 0
    	};

    	handle_promise(promise = /*trips*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*trips*/ 1 && promise !== (promise = /*trips*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[0] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function displayDate(utc_date_string) {
    	return new Date(utc_date_string).toLocaleString() + " current time";
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $app_errors;
    	validate_store(app_errors, "app_errors");
    	component_subscribe($$self, app_errors, $$value => $$invalidate(1, $app_errors = $$value));
    	let trips = [];

    	onMount(() => {
    		$$invalidate(0, trips = fetchTrips());
    	});

    	async function fetchTrips() {
    		const response = await getData("/api/trips");

    		if (response.data) {
    			return response.data;
    		} else if (response.errors) {
    			set_store_value(app_errors, $app_errors = [...$app_errors, ...response.errors]);
    		}

    		return [];
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("trips" in $$props) $$invalidate(0, trips = $$props.trips);
    		if ("$app_errors" in $$props) app_errors.set($app_errors = $$props.$app_errors);
    	};

    	return [trips];
    }

    class TripIndex extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TripIndex",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/routes/TripShow.svelte generated by Svelte v3.16.7 */
    const file$g = "src/routes/TripShow.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (50:2) {:else}
    function create_else_block$3(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*trip_data*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*trip_data*/ 1 && promise !== (promise = /*trip_data*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[0] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(50:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:2) {#if trip_data == undefined}
    function create_if_block$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(48:2) {#if trip_data == undefined}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { onMount }
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>   import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (53:4) {:then trip_data}
    function create_then_block$1(ctx) {
    	let div;
    	let h1;
    	let t0_value = /*trip_data*/ ctx[0].trip_name + "";
    	let t0;
    	let t1;
    	let small;
    	let button;
    	let t3;
    	let current;
    	let dispose;
    	let each_value = /*trip_data*/ ctx[0].itinerary;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			small = element("small");
    			button = element("button");
    			button.textContent = "Delete trip";
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(button, file$g, 57, 12, 1372);
    			add_location(small, file$g, 56, 10, 1352);
    			add_location(h1, file$g, 54, 8, 1305);
    			add_location(div, file$g, 53, 6, 1291);
    			dispose = listen_dev(button, "click", /*deleteTrip*/ ctx[1], false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, small);
    			append_dev(small, button);
    			append_dev(div, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*trip_data*/ 1) && t0_value !== (t0_value = /*trip_data*/ ctx[0].trip_name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*trip_data*/ 1) {
    				each_value = /*trip_data*/ ctx[0].itinerary;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(53:4) {:then trip_data}",
    		ctx
    	});

    	return block;
    }

    // (63:10) {#if i > 0}
    function create_if_block_3$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Return...";
    			attr_dev(div, "class", "separator svelte-1g1p002");
    			add_location(div, file$g, 63, 12, 1538);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(63:10) {#if i > 0}",
    		ctx
    	});

    	return block;
    }

    // (70:50) 
    function create_if_block_2$4(ctx) {
    	let current;
    	const layoversegment_spread_levels = [/*segment*/ ctx[8]];
    	let layoversegment_props = {};

    	for (let i = 0; i < layoversegment_spread_levels.length; i += 1) {
    		layoversegment_props = assign(layoversegment_props, layoversegment_spread_levels[i]);
    	}

    	const layoversegment = new LayoverSegment({
    			props: layoversegment_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layoversegment.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(layoversegment, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layoversegment_changes = (dirty & /*trip_data*/ 1)
    			? get_spread_update(layoversegment_spread_levels, [get_spread_object(/*segment*/ ctx[8])])
    			: {};

    			layoversegment.$set(layoversegment_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layoversegment.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layoversegment.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layoversegment, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(70:50) ",
    		ctx
    	});

    	return block;
    }

    // (68:14) {#if segment.type == 'flying'}
    function create_if_block_1$5(ctx) {
    	let current;
    	const flyingsegment_spread_levels = [/*segment*/ ctx[8]];
    	let flyingsegment_props = {};

    	for (let i = 0; i < flyingsegment_spread_levels.length; i += 1) {
    		flyingsegment_props = assign(flyingsegment_props, flyingsegment_spread_levels[i]);
    	}

    	const flyingsegment = new FlyingSegment({
    			props: flyingsegment_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(flyingsegment.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(flyingsegment, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const flyingsegment_changes = (dirty & /*trip_data*/ 1)
    			? get_spread_update(flyingsegment_spread_levels, [get_spread_object(/*segment*/ ctx[8])])
    			: {};

    			flyingsegment.$set(flyingsegment_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flyingsegment.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flyingsegment.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(flyingsegment, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(68:14) {#if segment.type == 'flying'}",
    		ctx
    	});

    	return block;
    }

    // (67:12) {#each item.route_segments as segment}
    function create_each_block_1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$5, create_if_block_2$4];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*segment*/ ctx[8].type == "flying") return 0;
    		if (/*segment*/ ctx[8].type == "layover") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(67:12) {#each item.route_segments as segment}",
    		ctx
    	});

    	return block;
    }

    // (62:8) {#each trip_data.itinerary as item, i}
    function create_each_block$6(ctx) {
    	let t0;
    	let div;
    	let t1;
    	let current;
    	let if_block = /*i*/ ctx[7] > 0 && create_if_block_3$2(ctx);
    	let each_value_1 = /*item*/ ctx[5].route_segments;
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			attr_dev(div, "class", "flight-wrapper svelte-1g1p002");
    			add_location(div, file$g, 65, 10, 1603);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*trip_data*/ 1) {
    				each_value_1 = /*item*/ ctx[5].route_segments;
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(62:8) {#each trip_data.itinerary as item, i}",
    		ctx
    	});

    	return block;
    }

    // (51:22)        Fetching trip data...     {:then trip_data}
    function create_pending_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Fetching trip data...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(51:22)        Fetching trip data...     {:then trip_data}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let section;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*trip_data*/ ctx[0] == undefined) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if_block.c();
    			add_location(section, file$g, 46, 0, 1146);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if_blocks[current_block_type_index].m(section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(section, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $app_errors;
    	validate_store(app_errors, "app_errors");
    	component_subscribe($$self, app_errors, $$value => $$invalidate(3, $app_errors = $$value));
    	let { params } = $$props;
    	let trip_data;

    	async function fetchTrip() {
    		const response = await getData(`/api/trips/${params.trip_id}`);

    		if (response.data) {
    			return response.data;
    		} else if (response.errors) {
    			set_store_value(app_errors, $app_errors = [...$app_errors, ...response.errors]);
    			push("/trips");
    			reject();
    		}
    	}

    	async function deleteTrip() {
    		const response = await deleteData(`/api/trips/${params.trip_id}`);

    		if (response.data) {
    			push("/trips");
    		} else if (response.errors) {
    			set_store_value(app_errors, $app_errors = [...$app_errors, ...response.errors]);
    		}
    	}

    	onMount(() => {
    		$$invalidate(0, trip_data = fetchTrip());
    	});

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TripShow> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("params" in $$props) $$invalidate(2, params = $$props.params);
    	};

    	$$self.$capture_state = () => {
    		return { params, trip_data, $app_errors };
    	};

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(2, params = $$props.params);
    		if ("trip_data" in $$props) $$invalidate(0, trip_data = $$props.trip_data);
    		if ("$app_errors" in $$props) app_errors.set($app_errors = $$props.$app_errors);
    	};

    	return [trip_data, deleteTrip, params];
    }

    class TripShow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$h, safe_not_equal, { params: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TripShow",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*params*/ ctx[2] === undefined && !("params" in props)) {
    			console.warn("<TripShow> was created without expected prop 'params'");
    		}
    	}

    	get params() {
    		throw new Error("<TripShow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<TripShow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function ensureAuth() {
        if (!get_store_value(auth_token)) {
            replace('/login');
            return false;
        }

        return true;
    }

    const routes = {
        '/': Login,
        '/login': Login,
        '/signup': Signup,
        '/trips/new': wrap(TripNew, ensureAuth),
        '/trips/:trip_id': wrap(TripShow, ensureAuth),
        '/trips': wrap(TripIndex, ensureAuth),
        '*': NotFound,
    };

    /* src/comp/Errors.svelte generated by Svelte v3.16.7 */
    const file$h = "src/comp/Errors.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (44:0) {#if errors.length > 0}
    function create_if_block$9(ctx) {
    	let div;
    	let ul;
    	let each_value = /*errors*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-2lmqf1");
    			add_location(ul, file$h, 45, 4, 800);
    			add_location(div, file$h, 44, 2, 790);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errors*/ 1) {
    				each_value = /*errors*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(44:0) {#if errors.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (47:6) {#each errors as error}
    function create_each_block$7(ctx) {
    	let li;
    	let t_value = /*error*/ ctx[3].message + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-2lmqf1");
    			add_location(li, file$h, 47, 8, 843);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errors*/ 1 && t_value !== (t_value = /*error*/ ctx[3].message + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(47:6) {#each errors as error}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let if_block_anchor;
    	let if_block = /*errors*/ ctx[0].length > 0 && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*errors*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $app_errors;
    	validate_store(app_errors, "app_errors");
    	component_subscribe($$self, app_errors, $$value => $$invalidate(1, $app_errors = $$value));
    	let errors = [];

    	let cleanup_interval = setInterval(
    		() => {
    			$$invalidate(0, errors = errors.filter(({ added_at }) => added_at + 3 * 1000 > Date.now()));
    		},
    		1000
    	);

    	onMount(() => {
    		return () => {
    			clearInterval(cleanup_interval);
    		};
    	});

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("errors" in $$props) $$invalidate(0, errors = $$props.errors);
    		if ("cleanup_interval" in $$props) cleanup_interval = $$props.cleanup_interval;
    		if ("$app_errors" in $$props) app_errors.set($app_errors = $$props.$app_errors);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$app_errors, errors*/ 3) {
    			 {
    				$app_errors.forEach(error => {
    					$$invalidate(0, errors = [...errors, { message: error, added_at: Date.now() }]);
    				});

    				set_store_value(app_errors, $app_errors = []);
    			}
    		}
    	};

    	return [errors];
    }

    class Errors extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Errors",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.16.7 */
    const file$i = "src/App.svelte";

    function create_fragment$j(ctx) {
    	let main;
    	let nav;
    	let a0;
    	let link_action;
    	let t1;
    	let a1;
    	let link_action_1;
    	let t3;
    	let t4;
    	let current;
    	let dispose;
    	const errors = new Errors({ $$inline: true });
    	const router = new Router({ props: { routes }, $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			nav = element("nav");
    			a0 = element("a");
    			a0.textContent = "All trips";
    			t1 = text("\n    |\n    ");
    			a1 = element("a");
    			a1.textContent = "New Trip";
    			t3 = space();
    			create_component(errors.$$.fragment);
    			t4 = space();
    			create_component(router.$$.fragment);
    			attr_dev(a0, "href", "/trips");
    			add_location(a0, file$i, 21, 4, 407);
    			attr_dev(a1, "href", "/trips/new");
    			add_location(a1, file$i, 23, 4, 457);
    			attr_dev(nav, "class", "svelte-1aohc5y");
    			add_location(nav, file$i, 20, 2, 397);
    			attr_dev(main, "class", "svelte-1aohc5y");
    			add_location(main, file$i, 19, 0, 388);

    			dispose = [
    				action_destroyer(link_action = link.call(null, a0)),
    				action_destroyer(link_action_1 = link.call(null, a1))
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, nav);
    			append_dev(nav, a0);
    			append_dev(nav, t1);
    			append_dev(nav, a1);
    			append_dev(main, t3);
    			mount_component(errors, main, null);
    			append_dev(main, t4);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(errors.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(errors.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(errors);
    			destroy_component(router);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
