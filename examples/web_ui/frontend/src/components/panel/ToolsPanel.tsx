import { Search, SearchX, Wrench } from 'lucide-react';
import { useState } from 'react';

import type { ToolInfo } from '@/api';
import { PanelEmpty } from '@/components/panel/PanelEmpty';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { useTranslation } from '@/i18n/useI18n.ts';

interface ToolsPanelProps {
	/** The builtin tools available in the session's workspace. */
	tools: ToolInfo[];
	/** Whether the tool list is still loading. */
	loading?: boolean;
}

/**
 * Pure content body for the builtin-tools dock panel: a search box and a
 * read-only list of the workspace's builtin tools (Read / Write / Bash /
 * Edit / Glob / Grep). Holds only local UI state (search text); all data
 * arrives via props so it owns no data fetching.
 *
 * Unlike MCP / skill panels, builtin tools are always present and cannot be
 * added or removed, so this panel is read-only.
 *
 * Renders without its own header/border — the surrounding `Panel` chrome
 * (from `PanelDock`) provides those.
 *
 * @param tools - The builtin tools to list.
 * @param loading - Whether the list is loading.
 * @returns The tools panel body.
 */
export function ToolsPanel({ tools, loading = false }: ToolsPanelProps) {
	const { t } = useTranslation();
	const [search, setSearch] = useState('');

	const filtered = search
		? tools.filter((tool) => tool.name.toLowerCase().includes(search.toLowerCase()))
		: tools;

	return (
		<div className="flex flex-col flex-1 min-h-0 gap-y-2">
			<span className="text-muted-foreground text-sm">{t('panel.tools.description')}</span>
			<InputGroup>
				<InputGroupInput
					placeholder={t('panel.tools.searchPlaceholder')}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<InputGroupAddon align="inline-end">
					<Search />
				</InputGroupAddon>
			</InputGroup>

			{loading ? (
				<div className="flex flex-1 items-center justify-center">
					<p className="text-muted-foreground text-sm">{t('panel.loading')}</p>
				</div>
			) : filtered.length === 0 ? (
				<PanelEmpty
					icon={search ? SearchX : Wrench}
					title={search ? t('panel.search.emptyTitle') : t('panel.tools.emptyTitle')}
					description={
						search
							? t('panel.search.emptyDescription', { query: search })
							: t('panel.tools.emptyDescription')
					}
				/>
			) : (
				<div className="flex flex-col flex-1 min-h-0 overflow-y-auto gap-y-2">
					{filtered.map((tool) => (
						<Item key={tool.name} variant="outline">
							<ItemContent>
								<ItemTitle>{tool.name}</ItemTitle>
								{tool.description ? (
									<ItemDescription className="line-clamp-2 whitespace-pre-wrap">
										{tool.description}
									</ItemDescription>
								) : null}
							</ItemContent>
						</Item>
					))}
				</div>
			)}
		</div>
	);
}
